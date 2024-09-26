import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTenantMapping } from '../entities/UserTenantMapping.entity';
import { CohortMembers } from '../entities/CohortMembers.entity';
import { Cohort } from '../entities/Cohort.entity';

@Injectable()
export class DataValidationService {
  @InjectRepository(UserTenantMapping)
  private readonly UserTenantMapping: Repository<UserTenantMapping>;
  @InjectRepository(CohortMembers)
  private readonly cohortMembers: Repository<CohortMembers>;
  @InjectRepository(Cohort)
  private readonly cohort: Repository<Cohort>;
  //check for user-tenant relation is valid
  async checkUserTenantValidation(userId: string, tenantId: string) {
    const result = await this.UserTenantMapping.findOne({
      where: { userId, tenantId },
    });
    if (result) return true;
    else return false;
  }
  //check for user-cohort relation is valid
  async checkUserCohortValidation(userId: string, cohortId: string) {
    const result = await this.cohortMembers.findOne({
      where: { userId, cohortId },
    });
    if (result) return true;
    else return false;
  }
  //check for cohort-tenant relation is valid
  async checkCohortTenantValidation(cohortId: string, tenantId: string) {
    const result = await this.cohort.findOne({ where: { cohortId, tenantId } });
    if (result) return true;
    else return false;
  }
}
