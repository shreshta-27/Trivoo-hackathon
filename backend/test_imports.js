// Minimal test to identify failing import
import dotenv from 'dotenv';
dotenv.config();

console.log('✅ Step 1: dotenv loaded');

import express from 'express';
console.log('✅ Step 2: express loaded');

import connectDB from './Config/db.js';
console.log('✅ Step 3: connectDB loaded');

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
console.log('✅ Step 4: ChatGoogleGenerativeAI loaded');

console.log('🎉 All imports successful!');
