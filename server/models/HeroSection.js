import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  buttonText: { type: String, default: 'Order Now' },
  images: {
    leftCake: { type: String },
    rightCake: { type: String },
    bottomDesserts: { type: String },
  },
  background: {
    gradient: { type: String, default: 'linear-gradient(135deg, #fff0f5 0%, #fffaf0 100%)' },
  },
}, { timestamps: true });

const HeroSection = mongoose.model('HeroSection', heroSectionSchema);
export default HeroSection;
