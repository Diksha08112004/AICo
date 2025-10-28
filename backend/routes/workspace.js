const router = require('express').Router();
const Workspace = require('../models/Workspace');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const q = userId ? { members: userId } : {};
    const workspaces = await Workspace.find(q).sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (e) {
    res.status(500).json({ error: 'WS_LIST_ERROR' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    const ws = await Workspace.create({ name, owner: ownerId, members: ownerId ? [ownerId] : [] });
    if (ownerId) await User.findByIdAndUpdate(ownerId, { $addToSet: { workspaces: ws._id } });
    res.status(201).json(ws);
  } catch (e) {
    res.status(500).json({ error: 'WS_CREATE_ERROR' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json(ws);
  } catch (e) {
    res.status(500).json({ error: 'WS_GET_ERROR' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ws = await Workspace.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(ws);
  } catch (e) {
    res.status(500).json({ error: 'WS_UPDATE_ERROR' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'WS_DELETE_ERROR' });
  }
});

router.post('/:id/tasks', async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ error: 'NOT_FOUND' });
    ws.tasks.push(req.body);
    await ws.save();
    res.status(201).json(ws);
  } catch (e) {
    res.status(500).json({ error: 'TASK_CREATE_ERROR' });
  }
});

router.put('/:id/tasks/:taskId', async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ error: 'NOT_FOUND' });
    const t = ws.tasks.id(req.params.taskId);
    if (!t) return res.status(404).json({ error: 'TASK_NOT_FOUND' });
    Object.assign(t, req.body);
    await ws.save();
    res.json(ws);
  } catch (e) {
    res.status(500).json({ error: 'TASK_UPDATE_ERROR' });
  }
});

router.delete('/:id/tasks/:taskId', async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id);
    if (!ws) return res.status(404).json({ error: 'NOT_FOUND' });
    const t = ws.tasks.id(req.params.taskId);
    if (!t) return res.status(404).json({ error: 'TASK_NOT_FOUND' });
    t.deleteOne();
    await ws.save();
    res.json(ws);
  } catch (e) {
    res.status(500).json({ error: 'TASK_DELETE_ERROR' });
  }
});

module.exports = router;
