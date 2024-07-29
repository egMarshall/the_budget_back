import { Injectable } from '@nestjs/common';
import { CreateBudgetItemDto } from './dto/create-budget_item.dto';
import { UpdateBudgetItemDto } from './dto/update-budget_item.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BudgetItemsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBudgetItemDto) {
    const budgetItemExists = await this.prisma.items.findFirst({
      where: {
        name: data.name,
      },
    });

    const userExists = await this.prisma.user.findFirst({
      where: {
        id: data.user_id,
      },
    });

    if (!userExists) {
      throw new Error('User does not exist');
    }

    if (budgetItemExists) {
      throw new Error('Budget item already exists');
    }

    const budgetItem = await this.prisma.items.create({
      data,
    });

    return budgetItem;
  }

  async findAll() {
    const allItems = await this.prisma.items.findMany();

    if (allItems.length < 1) {
      throw new Error('No budget items found');
    }

    return allItems;
  }

  async findOne(id: string) {
    const item = await this.prisma.items.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }

  async update(id: string, data: UpdateBudgetItemDto) {
    const budgetItemExists = await this.prisma.items.findUnique({
      where: {
        id,
      },
    });

    if (!budgetItemExists) {
      throw new Error('Budget item does not exist');
    }

    return await this.prisma.items.update({
      data,
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const budgetItemExists = await this.prisma.items.findUnique({
      where: {
        id,
      },
    });

    if (!budgetItemExists) {
      throw new Error('Budget item does not exist');
    }

    await this.prisma.items.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Budget item removed',
    };
  }
}