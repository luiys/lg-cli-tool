#!/usr/bin/env node
import { generateController } from './controller/generateController'
import { generateEntities } from './entities/generateEntities'

export function generate(schematic: 'controller', options: { dir: string }) {

    if (schematic.toLowerCase() === 'controller') return generateController(options.dir)
    if (schematic.toLowerCase() === 'entities') return generateEntities()

    throw new Error(`Unknown shematic type: ${schematic}`)

}

