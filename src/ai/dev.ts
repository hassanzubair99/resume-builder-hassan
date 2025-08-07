'use server';

import {config} from 'dotenv';
config({path: '.env.local'});

import '@/ai/flows/optimize-resume-content.ts';
import '@/ai/flows/enhance-resume.ts';
