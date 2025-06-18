const Roadmap = require('../models/Roadmap');
const { Stage, ContentStage, QuizStage } = require('../models/Stage');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
require('express-async-errors');
const UserRoadmap = require('../models/UserRoadmap');
const Certificate = require('../models/Certificate');
const RecommendedRoadmap = require('../models/RecommenedRoadmap');
const Appointment = require('../models/Appointment');
exports.getRoadmaps = async (req, res, next) => {
  const categories = await Roadmap.distinct('category').lean();

  const roadmaps = await Roadmap.find().select('title image category').lean();

  res.json({
    success: true,
    data: {
      categories,
      roadmaps,
    },
  });
};

exports.getRoadmap = async (req, res, next) => {
  const { id } = req.params;

  const roadmap = await Roadmap.findById(id).lean();
  if (!roadmap) {
    return res.status(404).json({ message: 'Roadmap not found' });
  }

  const stages = await Stage.find({ roadmap: id })
    .select('title number description type questionsCount')
    .sort('number')
    .lean();

  roadmap.stages = stages;

  return res.json({
    success: true,
    data: { roadmap },
  });
};

exports.getRoadmapStage = async (req, res, next) => {
  const { id, number } = req.params;
  const stageNumber = parseInt(number, 10);
  const currentUserId = req.user._id;

  const user = await User.findById(currentUserId).lean();
  const isStudent = user?.role === 'student';

  if (!user) return next(new AppError('User not found', 404));

  const userRoadmap = await UserRoadmap.findOne({
    user: currentUserId,
    roadmap: id,
  })
    .populate({
      path: 'roadmap',
      select: 'title stagesCount _id',
    })
    .lean()
    .select('roadmap completedStages completed _id');

  if (!userRoadmap && isStudent) {
    return next(new AppError('Enroll in the roadmap first', 404));
  }

  if (isStudent && stageNumber > userRoadmap.completedStages + 1) {
    return next(
      new AppError(
        'Complete the previous stage before progressing to the next stage',
        400
      )
    );
  }

  const stage = await Stage.findOne({ roadmap: id, number: stageNumber })
    .select('-description -roadmap')
    .lean();

  if (!stage) return next(new AppError('Stage not found', 404));

  if (stage.type === 'content') {
    const contentStage = await ContentStage.findById(stage._id).lean();
    return res.json({
      success: true,
      data: { stage: contentStage },
    });
  }

  if (stage.type === 'quiz') {
    const quizStage = await QuizStage.findById(stage._id).lean();
    if (!quizStage) return next(new AppError('Quiz stage not found', 404));
    return res.json({
      success: true,
      data: { stage: quizStage },
    });
  }

  return next(new AppError('Invalid stage type', 400));
};

exports.createRoadmap = async (req, res, next) => {
  const { title, description, category, image } = req.body;
  if (!title || !description || !category || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existingRoadmap = await Roadmap.findOne({ title });
  if (existingRoadmap) {
    return res
      .status(400)
      .json({ message: 'Roadmap with this title already exists' });
  }

  const roadmap = await Roadmap.create({
    title,
    description,
    category,
  });

  if (!roadmap) {
    return res.status(500).json({ message: 'Failed to create roadmap' });
  }
  res.status(201).json({
    success: true,
    data: { roadmap },
  });
};

exports.addRoadmapStage = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, type, number } = req.body;

  if (!title || !description || !type || number === undefined) {
    return next(new AppError('Missing required fields', 400));
  }

  if (type !== 'content' && type !== 'quiz') {
    return next(new AppError('Invalid stage type', 400));
  }

  const roadmap = await Roadmap.findById(id);
  if (!roadmap) {
    return next(new AppError('Roadmap not found', 404));
  }

  if (number < 0 || number > roadmap.stagesCount + 1) {
    return next(new AppError('Invalid stage number', 400));
  }

  const stage = await Stage.create({
    title,
    description,
    type,
    number,
    roadmap: id,
  });

  roadmap.stagesCount += 1;
  await roadmap.save();

  res.status(201).json({
    success: true,
    data: { stage },
  });
};

exports.deleteRoadmapStage = async (req, res, next) => {
  const { id, stageId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const roadmap = await Roadmap.findById(id).session(session);
    if (!roadmap) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const stage = await Stage.findById(stageId).session(session);
    if (!stage) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Stage not found' });
    }

    if (stage.roadmap.toString() !== id) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: 'Stage does not belong to this roadmap' });
    }

    const allStages = await Stage.find({ roadmap: id })
      .sort('number')
      .session(session);

    for (let i = 0; i < allStages.length; i++) {
      if (allStages[i]._id.toString() === stageId) {
        for (let j = i + 1; j < allStages.length; j++) {
          await Stage.findByIdAndUpdate(
            allStages[j]._id,
            { $inc: { number: -1 } },
            { session }
          );
        }
        break;
      }
    }

    roadmap.stagesCount -= 1;
    await roadmap.save({ session });

    // Delete the stage
    await Stage.findByIdAndDelete(stageId, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stage deleted successfully',
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.updateRoadmapStage = async (req, res, next) => {
  const { id, stageId } = req.params;
  const {
    title,
    description,
    number,
    videos,
    docs,
    questions,
    questionsCount,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const roadmap = await Roadmap.findById(id).session(session);
    if (!roadmap) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (number !== undefined && (number < 0 || number > roadmap.stagesCount)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid stage number' });
    }

    const stage = await Stage.findById(stageId).session(session);
    if (!stage) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Stage not found' });
    }

    if (stage.roadmap.toString() !== id) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: 'Stage does not belong to this roadmap' });
    }

    // Handle number change logic if number is provided
    if (number !== undefined && stage.number !== number) {
      const oldNumber = stage.number;
      const newNumber = number;

      if (newNumber > oldNumber) {
        await Stage.updateMany(
          {
            roadmap: id,
            number: { $gt: oldNumber, $lte: newNumber },
          },
          { $inc: { number: -1 } },
          { session }
        );
      } else if (newNumber < oldNumber) {
        await Stage.updateMany(
          {
            roadmap: id,
            number: { $gte: newNumber, $lt: oldNumber },
          },
          { $inc: { number: 1 } },
          { session }
        );
      }

      stage.number = newNumber;
    }

    // Update fields only if provided
    if (title !== undefined) stage.title = title;
    if (description !== undefined) stage.description = description;

    if (stage.type === 'content') {
      if (videos !== undefined) stage.videos = videos;
      if (docs !== undefined) stage.docs = docs;
    } else if (stage.type === 'quiz') {
      if (questions !== undefined) {
        if (!Array.isArray(questions)) {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Invalid questions format' });
        }
        stage.questions = questions;
      }
    }

    stage.questionsCount = questionsCount;

    await stage.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stage updated successfully',
      data: stage,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.deleteRoadmap = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const roadmapId = req.params.id;

    const roadmap = await Roadmap.findByIdAndDelete(roadmapId, { session });

    if (!roadmap) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('No roadmap found with that ID.', 404));
    }

    await Promise.all([
      UserRoadmap.deleteMany({ roadmap: roadmapId }, { session }),
      Certificate.deleteMany({ roadmap: roadmapId }, { session }),
      RecommendedRoadmap.deleteMany({ roadmaps: roadmapId }, { session }),
      Appointment.deleteMany({ roadmap: roadmapId }, { session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(204).json({
      success: true,
      message: 'Roadmap deleted successfully',
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(new AppError(err.message || 'Something went wrong.', 500));
  }
};
