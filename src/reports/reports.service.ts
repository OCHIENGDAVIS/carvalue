import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}
  async create(reportDto: CreateReportDto, user: User) {
    const report = this.reportRepo.create(reportDto);
    report.user = user;
    return await this.reportRepo.save(report);
  }

  async changeAproval(id: string, approve: Boolean) {
    const report = await this.reportRepo.findOne({
      where: { id: parseInt(id) },
    });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approve;
    return await this.reportRepo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    return await this.reportRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make= :make', { make: estimateDto.make })
      .andWhere('model= model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :lat BETWEEN -3 AND 3', { year: estimateDto.year })
      .orderBy('ABS(mileage - :mileage)')
      .setParameters({ mileage: estimateDto.mileage })
      .andWhere('approved is TRUE')
      .limit(3)
      .getRawOne();
  }
}
