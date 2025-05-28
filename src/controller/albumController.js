import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

export const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    fs.unlinkSync(imageFile.path);

    const newAlbum = await albumModel.create({
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url
    });

    res.status(201).json({ message: '📀 Album created successfully', album: newAlbum });
  } catch (err) {
    console.error('❌ Error adding album:', err.message);
    res.status(500).json({ error: 'Failed to add album' });
  }
};

export const listAlbums = async (req, res) => {
  try {
    const albums = await albumModel.find({});
    res.json(albums);
  } catch (err) {
    console.error('❌ Error listing albums:', err.message);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const deleted = await albumModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting album:', err.message);
    res.status(500).json({ error: 'Failed to delete album' });
  }
};
