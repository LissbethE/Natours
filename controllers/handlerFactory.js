const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');

////////////////////////////////
// Get All DOC
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET Reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Execute Query
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Improving Read Performance with indexes
    //const doc = await features.query.explain();
    const doc = await features.query;

    // Send Response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

////////////////////////////////
// Get DOC
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc)
      return next(new AppError('🙅 No document found with that ID 💥', 404));

    // Send Response
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

////////////////////////////////
// Create DOC
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Real datos
    const doc = await Model.create(req.body);

    if (!doc) return next(new AppError('🙅 Invalid data sent!💥', 404));

    // Send Response
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

////////////////////////////////
// UPDATE DOC
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const options = { new: true, runValidators: true };
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, options);

    if (!doc)
      return next(new AppError('🙅 No document found with that ID 💥', 404));

    // Send Response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

////////////////////////////////
// DELETE DOC
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('🙅 No doc found with that ID 💥', 404));

    // Send Response
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
