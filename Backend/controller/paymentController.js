import mongoose from "mongoose";
import Payment from "../model/Payment.js";

export const createPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const payload = {
      userId: req.body.userId || null,
      amount: req.body.amount,
      currency: req.body.currency,
      method: req.body.method,
      status: req.body.status || "pending",
      description: req.body.description,
      reference: req.body.reference,
      metadata: req.body.metadata || {},
      createdBy: req.actor,
      updatedBy: req.actor
    };

    const doc = await Payment.create([payload], { session });
    await session.commitTransaction();
    res.status(201).json({ data: doc[0] });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const {
      q,
      status,
      method,
      currency,
      sort = "-createdAt",
      page = 1,
      limit = 10,
      includeDeleted
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (currency) filter.currency = currency;
    if (q) {
      filter.$or = [
        { description: { $regex: q, $options: "i" } },
        { reference: { $regex: q, $options: "i" } }
      ];
    }
    if (includeDeleted === "true") filter._withDeleted = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Payment.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Payment.countDocuments({ ...filter, _withDeleted: undefined, isDeleted: false })
    ]);

    res.json({
      data: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Payment not found" });
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
};

export const updatePayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updates = {
      ...req.body,
      updatedBy: req.actor
    };
    const doc = await Payment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updates,
      { new: true, runValidators: true, session }
    );
    if (!doc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Payment not found or deleted" });
    }
    await session.commitTransaction();
    res.json({ data: doc });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const softDeletePayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doc = await Payment.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), updatedBy: req.actor },
      { new: true, session }
    );
    if (!doc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Payment not found or already deleted" });
    }
    await session.commitTransaction();
    res.json({ message: "Payment deleted", data: doc });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};
