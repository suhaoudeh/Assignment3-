import Education from '../models/education.js';

// Helper: normalize owner id from possible shapes (ObjectId, populated doc, string)
const extractOwnerId = (owner) => {
  if (!owner) return null;
  if (typeof owner === 'string') return owner;
  if (owner._id) return owner._id.toString();
  if (owner.toString && typeof owner.toString === 'function') return owner.toString();
  return null;
};

// Return education entries belonging to the authenticated user
export const getAllEducation = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const items = await Education.find({ user: userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching education', error: err.message });
  }
};

export const getEducationById = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const itemOwnerId = extractOwnerId(item.user);
    if (!itemOwnerId) return res.status(403).json({ message: 'Forbidden: item has no owner' });
    if (itemOwnerId !== userId) return res.status(403).json({ message: 'Forbidden' });
    res.json(item);
  } catch (err) {
    console.error('getEducationById error:', err);
    res.status(500).json({ message: 'Error fetching education', error: err.message });
  }
};

export const createEducation = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const newItem = new Education({ ...req.body, user: userId });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error creating education', error: err.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const itemOwnerId = extractOwnerId(item.user);
    if (!itemOwnerId) return res.status(403).json({ message: 'Forbidden: item has no owner' });
    if (itemOwnerId !== userId) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    console.error('updateEducation error:', err);
    res.status(400).json({ message: 'Error updating education', error: err.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const item = await Education.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const itemOwnerId = extractOwnerId(item.user);
    if (!itemOwnerId) return res.status(403).json({ message: 'Forbidden: item has no owner' });
    if (itemOwnerId !== userId) return res.status(403).json({ message: 'Forbidden' });
    try {
      // Use model deletion to avoid calling document.remove() on a plain object
      await Education.findByIdAndDelete(req.params.id);
    } catch (removeErr) {
      console.error('findByIdAndDelete failed for education id', req.params.id, removeErr);
      return res.status(500).json({ message: 'Error deleting education', error: removeErr.message });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteEducation error:', err);
    res.status(500).json({ message: 'Error deleting education', error: err.message });
  }
};
