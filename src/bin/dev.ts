#!/usr/bin/env node
import { dev } from 'src/main'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

dev()