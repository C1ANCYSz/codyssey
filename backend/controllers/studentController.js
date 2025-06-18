const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const UserRoadmap = require('../models/UserRoadmap');
const Certificate = require('../models/Certificate');
const Appointment = require('../models/Appointment');
const Question = require('../models/Question');
const RecommendedRoadmap = require('../models/RecommenedRoadmap');
const AppError = require('../utils/AppError');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const { generateCertificateHTML } = require('../utils/generateCertificateHTML');

exports.enrollInRoadmap = async (req, res, next) => {
  const roadmapId = req.params.id;
  const userId = req.user?._id;

  const [roadmap, user, existingEnrollment] = await Promise.all([
    Roadmap.findById(roadmapId),
    User.findById(userId),
    UserRoadmap.findOne({ user: userId, roadmap: roadmapId }),
  ]);

  if (!roadmap) return next(new AppError('Roadmap not found', 404));
  if (!user) return next(new AppError('User not found', 404));

  if (existingEnrollment) {
    return next(new AppError('You are already enrolled in this roadmap', 400));
  }

  await UserRoadmap.create({
    user: userId,
    roadmap: roadmapId,
  });

  res.status(200).json({
    success: true,
    message: 'Successfully enrolled in roadmap',
    data: { roadmap },
  });
};

exports.getDashboard = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).lean();
  const userRoadmaps = await UserRoadmap.find({ user: userId })
    .populate({
      path: 'roadmap',
      select: 'title image stagesCount',
    })
    .select('roadmap completedStages completed _id')
    .lean();
  user.roadmaps = userRoadmaps;

  if (!user) return next(new AppError('User not found', 404));

  if (user.role === 'student') {
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        role: user.role,
        name: user.name,
        roadmaps: user.roadmaps,
      },
    });
  }
};

exports.roadmapProgress = async (req, res, next) => {
  const { id } = req.params;
  const { completedStages } = req.body;

  if (typeof completedStages !== 'number' || completedStages < 0) {
    return next(new AppError('Invalid or missing completedStages', 400));
  }

  const [roadmap, user] = await Promise.all([
    Roadmap.findById(id),
    User.findById(req.user._id),
  ]);

  if (!roadmap) {
    return next(new AppError('Roadmap not found', 404));
  }

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const userRoadmap = await UserRoadmap.findOne({
    user: user._id,
    roadmap: id,
  });

  if (!userRoadmap) {
    return next(new AppError('User is not enrolled in this roadmap', 404));
  }

  if (completedStages > roadmap.stagesCount) {
    return next(
      new AppError(
        `completedStages cannot exceed total stages (${roadmap.stagesCount})`,
        400
      )
    );
  }

  userRoadmap.completedStages = completedStages;
  userRoadmap.completed = completedStages === roadmap.stagesCount;

  await userRoadmap.save({ validateBeforeSave: false });

  const certificate = await Certificate.findOne({
    user: user._id,
    roadmap: roadmap._id,
  });

  if (userRoadmap.completed && !certificate) {
    await Certificate.create({
      user: user._id,
      roadmap: roadmap._id,
      date: new Date(),
    });
  } else if (!userRoadmap.completed && certificate) {
    await Certificate.deleteOne({ user: user._id, roadmap: roadmap._id });
  }

  res.status(200).json({
    success: true,
    message: userRoadmap.completed ? 'Roadmap completed!' : 'Progress updated.',
    completed: userRoadmap.completed,
  });
};

exports.getCertificates = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const certificates = await Certificate.find({ user: userId })
      .populate({
        path: 'roadmap',
        select: 'title image',
      })
      .lean();

    for (const certificate of certificates) {
      const exists = await Appointment.exists({
        user: userId,
        roadmap: certificate.roadmap._id,
      });

      certificate.isBooked = !!exists;
    }

    if (certificates.length === 0) {
      return res.status(200).json({
        success: true,
        data: { certificates: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: { certificates },
    });
  } catch (err) {
    next(err);
  }
};

exports.downloadCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const certificate = await Certificate.findOne({
      user: userId,
      _id: id,
    }).populate({
      path: 'roadmap',
      select: 'title',
    });

    if (!certificate) return next(new AppError('Certificate not found', 404));

    const certificateHTML = generateCertificateHTML(
      req.user,
      certificate.roadmap.title,
      certificate.date.toLocaleDateString()
    );

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(certificateHTML, { waitUntil: 'domcontentloaded' });

    // Optional: Set page style for screen media
    await page.emulateMedia('screen');

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=certificate.pdf'
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Certificate PDF generation error:', err);
    next(new AppError('Failed to generate certificate', 500));
  }
};

exports.updateStudent = async (req, res, next) => {
  const { id } = req.user;

  const { password, name, email } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (password) user.password = password;

  if (name) user.name = name;
  if (email) user.email = email;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'User updated successfully' });
};

exports.getAppointments = async (req, res, next) => {
  const appointments = await Appointment.find({ user: req.user.id })
    .populate({
      path: 'roadmap',
      select: 'title image',
    })
    .populate({
      path: 'academy',
      select: 'name email image',
    });

  if (!appointments) {
    return res.json({ success: true, data: {} });
  }

  res.json({ success: true, data: { appointments } });
};

exports.getBookAppointments = async (req, res, next) => {
  const academies = await User.find({ role: 'academy' });

  if (!academies) {
    return res.json({
      success: true,
      message: 'No academies found',
      data: {},
    });
  }

  res.json({ success: true, data: { academies } });
};

exports.bookAppointment = async (req, res, next) => {
  const { roadmapId, academyId, location } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) {
    return next(new AppError('No roadmap found with this ID', 404));
  }

  const userRoadmap = await UserRoadmap.findOne({
    user: id,
    roadmap: roadmapId,
  });
  if (!userRoadmap || !userRoadmap.completed) {
    return next(new AppError('You are not enrolled in this roadmap', 400));
  }

  const academy = await User.findById(academyId);
  if (!academy) {
    return next(new AppError('No academy found with this ID', 404));
  }

  if (!academy.locations.includes(location)) {
    return next(new AppError('This academy does not have this location', 400));
  }

  if (!location || !roadmapId || !academyId) {
    return next(new AppError('Please provide all the required fields', 400));
  }

  const sameAppointment = await Appointment.findOne({
    user: id,

    roadmap: roadmapId,
  });
  if (sameAppointment) {
    return next(
      new AppError('You already have an appointment for this roadmap', 400)
    );
  }

  const appointment = await Appointment.create({
    user: id,
    academy: academyId,
    roadmap: roadmapId,

    location,
  });

  res.status(201).json({
    success: true,
    message: 'Successfully created an appointment',
    data: { appointment },
  });
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(new AppError('No user found with this ID', 404));

    const appointment = await Appointment.findById(id);

    if (!appointment)
      return next(new AppError('No appointment found with this ID', 404));

    if (
      user.role !== 'student' ||
      appointment.user.toString() !== userId ||
      !['pending', 'rejected'].includes(appointment.status)
    ) {
      return next(
        new AppError('You are not allowed to delete this appointment', 403)
      );
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Successfully deleted an appointment',
    });
  } catch (error) {
    next(error);
  }
};

exports.answerQuestionnare = async (req, res, next) => {
  try {
    const { selectedAnswers } = req.body;

    if (!Array.isArray(selectedAnswers) || selectedAnswers.length === 0) {
      return next(new AppError('No answers provided', 400));
    }

    const questions = await Question.find({});
    const roadmaps = await Roadmap.find({}, 'title category image');

    if (!questions.length) {
      return next(new AppError('No questions found', 404));
    }
    if (!roadmaps.length) {
      return next(new AppError('No roadmaps found', 404));
    }

    const roadmapMap = new Map();
    roadmaps.forEach((r) =>
      roadmapMap.set(r.title.toLowerCase(), { ...r._doc, score: 0 })
    );

    let impactedRoadmapsCount = 0;

    for (const answerText of selectedAnswers) {
      if (!answerText) continue;

      const answer = questions
        .flatMap((q) => q.answers)
        .find((a) => a.text === answerText);

      if (answer && Array.isArray(answer.impacts)) {
        answer.impacts.forEach((impact) => {
          if (impact.roadmap && typeof impact.score === 'number') {
            const roadmapTitle = impact.roadmap.toLowerCase();
            if (roadmapMap.has(roadmapTitle)) {
              impactedRoadmapsCount++;
              roadmapMap.get(roadmapTitle).score += impact.score;
            }
          }
        });
      }
    }

    if (impactedRoadmapsCount === 0) {
      return next(
        new AppError(
          'Not enough valid answers to generate recommendations',
          404
        )
      );
    }

    const sortedRoadmaps = [...roadmapMap.values()]
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    const [firstTop, secondTop, thirdTop] =
      sortedRoadmaps.length >= 3
        ? sortedRoadmaps
        : [
            sortedRoadmaps[0],
            sortedRoadmaps[1] || null,
            sortedRoadmaps[2] || null,
          ];

    let existingRecommendation = await RecommendedRoadmap.findOne({
      user: req.user._id,
    });

    const validRoadmaps = [firstTop?._id, secondTop?._id, thirdTop?._id].filter(
      Boolean
    );

    if (existingRecommendation) {
      existingRecommendation.roadmaps = validRoadmaps;
      await existingRecommendation.save();
    } else {
      await RecommendedRoadmap.create({
        user: req.user._id,
        roadmaps: validRoadmaps,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.tookQuestionnaire = true;
    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      roadmaps: validRoadmaps.map((roadmapId) => {
        const roadmap = roadmaps.find(
          (r) => r._id.toString() === roadmapId.toString()
        );
        return {
          id: roadmap?._id,
          title: roadmap?.title,
          category: roadmap?.category,
          image: roadmap?.image,
        };
      }),
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return next(new AppError('Server error while submitting answers', 500));
  }
};

exports.skipQuestionnare = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.tookQuestionnaire = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Questionnaire skipped successfully',
  });
};

exports.getRecommendedRoadmaps = async (req, res, next) => {
  try {
    const recommended = await RecommendedRoadmap.find({
      user: req.user._id,
    })
      .select('roadmaps -_id')
      .populate({
        path: 'roadmaps',
        select: 'title image _id category',
      });

    if (!recommended.length) {
      return res.json({
        success: true,
        message: "You haven't taken the questionnaire yet.",
      });
    }

    const roadmaps = recommended[0].roadmaps.map((r) => ({
      _id: r._id,
      title: r.title,
      image: r.image,
      category: r.category,
    }));

    res.status(200).json({
      success: true,
      roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionnare = async (req, res, next) => {
  const questions = await Question.find({}).select('question answers.text'); // Selecting only 'question' and 'answers.text'

  if (!questions) {
    return next(new AppError('No Questions found', 404));
  }

  res.status(200).json({
    status: 'success',
    questions,
  });
};

exports.defaultRoadmap = async (userId) => {
  const roadmap = await Roadmap.findById('685069f741370b91d905a3d5');
  if (!roadmap) {
    throw new AppError('Default roadmap not found', 404);
  }

  const existingEnrollment = await UserRoadmap.findOne({
    user: userId,
    roadmap: roadmap._id,
  });

  if (existingEnrollment) {
    return;
  }

  await UserRoadmap.create({
    user: userId,
    roadmap: roadmap._id,
  });
};
