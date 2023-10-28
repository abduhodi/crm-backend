import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeachersService } from '../teachers/teachers.service';
import { GroupTeacher } from './schemas/group_teacher.schema';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupTeacherDto } from './dto/create-group_teacher.dto';
import { CourseTeachersService } from '../course_teachers/course_teachers.service';

@Injectable()
export class GroupTeachersService {
  constructor(
    @InjectModel(GroupTeacher.name)
    private readonly groupTeacherModel: Model<GroupTeacher>,
    private readonly groupService: GroupsService,
    private readonly teacherService: TeachersService,
    private readonly courseTeachersService: CourseTeachersService,
  ) {}

  //----------------------- ADD TEACHER TO GROUP -----------------------------//

  async addTeacherToGroup(createGroupTeacherDto: CreateGroupTeacherDto) {
    const { group, teacher } = createGroupTeacherDto;

    const { group: groupData } = await this.groupService.fetchSingleGroup(
      group,
    );

    if (!groupData) {
      throw new BadRequestException('Group is not found');
    }

    const { teacher: teacherData } = await this.teacherService.findOneTeacher(
      teacher,
    );

    if (!teacherData) {
      throw new BadRequestException('Teacher is not found');
    }
    const isTeachCourseMember =
      await this.courseTeachersService.findCourseMemberTeacher(
        //@ts-ignore
        groupData.course?._id?.toString(),
        teacherData.id,
      );
    if (!isTeachCourseMember) {
      throw new BadRequestException(
        "Teacher is not added to this group's course",
      );
    }

    const exist = await this.groupTeacherModel.findOne({ group, teacher });

    if (exist) {
      throw new BadRequestException('Teacher is already added to this Group');
    }

    const newMember = await this.groupTeacherModel.create(
      createGroupTeacherDto,
    );

    return { response: newMember };
  }

  //----------------------- FIND ALL TEACHERS IN ALL GROUPS -----------------------------//

  findAll() {
    return this.groupTeacherModel.find();
  }

  //----------------------- FIND ALL TEACHERS IN ONE GROUP -----------------------------//

  async findAllTeachers(id: string) {
    const teachers = await this.groupTeacherModel
      .find({ group: id })
      .populate('teacher')
      .select('teacher');
    return { teachers };
  }

  //----------------------- FIND TEACHER ALL GROUPS -----------------------------//

  async findAllGroups(id: string) {
    const groups = await this.groupTeacherModel
      .find({ teacher: id })
      .populate({
        path: 'group',
        populate: 'room course',
      })
      .select('group');

    return { groups: groups.map((item) => item.group) };
  }

  //----------------------- UPDATE TEACHER IN ONE GROUP -----------------------------//

  update(updateDto: CreateGroupTeacherDto) {
    return `This action updates a courseTeacher`;
  }

  //----------------------- DELETE TEACHER FROM ONE COURSE -----------------------------//

  async removeTeacherFromGroup(removeDto: CreateGroupTeacherDto) {
    const { group, teacher } = removeDto;

    const { group: groupData } = await this.groupService.fetchSingleGroup(
      group,
    );

    if (!groupData) {
      throw new BadRequestException('Group is not found');
    }

    const { teacher: teacherData } = await this.teacherService.findOneTeacher(
      teacher,
    );

    if (!teacherData) {
      throw new BadRequestException('Teacher is not found');
    }

    const isTeachCourseMember =
      await this.courseTeachersService.findCourseMemberTeacher(
        groupData.course,
        teacher,
      );

    if (!isTeachCourseMember) {
      throw new BadRequestException(
        "Teacher is not added to this group's course",
      );
    }

    const exist = await this.groupTeacherModel.findOne({ group, teacher });

    if (!exist) {
      throw new BadRequestException('Teacher is not added to this Group');
    }

    await exist.deleteOne();

    return { message: 'delete success' };
  }
}
