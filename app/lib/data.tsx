"use server"

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import {Prisma} from "@prisma/client/extension";

const connectionString = `${process.env["DATABASE_URL "]}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })


export async function createEventGroup(name:string, master_address:string) {
    await prisma.eventGroup.create({
        data: {
            name: name,
            master_address: master_address,
        }
    })
}

export async function showALLEventGroup() {
    const eventGroups = await prisma.eventGroup.findMany()
}
