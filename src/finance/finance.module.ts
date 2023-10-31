import { Module, forwardRef } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Finance, FinanceSchema } from './schemas/finance.schema';
import { Lesson, LessonSchema } from '../lessons/schemas/lesson.schema';
import { LessonsModule } from '../lessons/lessons.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Finance.name, schema: FinanceSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => LessonsModule),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
