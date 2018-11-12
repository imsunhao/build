#!/usr/bin/env node
import { build } from 'src/main'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

build()
