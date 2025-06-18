const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const UserRoadmap = require('../models/UserRoadmap');
const AppError = require('../utils/AppError');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res, next) => {
  const roadmaps = await Roadmap.countDocuments();
  const contentManagers = await User.countDocuments({
    role: 'content manager',
  });
  const academies = await User.countDocuments({ role: 'academy' });
  const students = await User.countDocuments({ role: 'student' });

  const topRoadmaps = await UserRoadmap.aggregate([
    { $match: { completed: true } },
    {
      $lookup: {
        from: 'roadmaps',
        localField: 'roadmap',
        foreignField: '_id',
        as: 'roadmap',
      },
    },
    { $unwind: '$roadmap' },
    {
      $group: {
        _id: '$roadmap._id',
        title: { $first: '$roadmap.title' },
        category: { $first: '$roadmap.category' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        title: 1,
        category: 1,
        count: 1,
      },
    },
  ]);

  const roadmapsByCategory = await Roadmap.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1,
      },
    },
  ]);

  const usersPerDay = await User.aggregate([
    { $match: { role: 'student' } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        count: 1,
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      roadmaps,
      contentManagers,
      academies,
      students,
      topRoadmaps,
      roadmapsByCategory,
      usersPerDay,
    },
  });
};

exports.getContentManagers = async (req, res, next) => {
  const contentManagers = await User.find({ role: 'content manager' }).select(
    '_id name email phoneNumber image isRevoked'
  );
  if (!contentManagers) {
    res.json({ success: true, data: {} });
  }
  res.json({ success: true, data: { contentManagers } });
};

exports.manageContentManagers = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  if (user.role !== 'content manager') {
    user.role = 'content manager';
    await user.save({ validateBeforeSave: false });
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
};

exports.getAcademies = async (req, res, next) => {
  const academies = await User.find({ role: 'academy' });
  if (!academies) {
    res.json({ success: true, data: {} });
  }
  res.json({ success: true, data: { academies } });
};

exports.manageAcademies = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  if (user.role !== 'academy') {
    user.role = 'academy';
    await user.save({ validateBeforeSave: false });
  }

  res.json({ success: true, message: 'User updated successfully' });
};

exports.addNotification = async (req, res, next) => {
  const { text } = req.body;

  let notification = await Notification.findOne();

  if (!notification) {
    await Notification.create({ text });
    return res.json({
      success: true,
      message: 'Notification created successfully',
    });
  }

  notification.text = text;
  await notification.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Notification updated successfully' });
};

exports.deleteNotification = async (req, res, next) => {
  let notification = await Notification.findOne();

  if (!notification) {
    return next(new AppError('No notification found', 404));
  }

  await Notification.findByIdAndDelete(notification._id);

  res.json({ success: true, message: 'Notification deleted successfully' });
};

exports.toggleRevoke = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  user.isRevoked = !user.isRevoked;
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: `User has been ${user.isRevoked ? 'revoked' : 'unrevoked'}`,
  });
};
