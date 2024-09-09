import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserTenantMapping } from "../entities/UserTenantMapping.entity";
import { CohortMembers } from "../entities/CohortMembers.entity";

@Injectable()
export class DataValidationService {
    @InjectRepository(UserTenantMapping)
    private readonly UserTenantMapping: Repository<UserTenantMapping>
    @InjectRepository(CohortMembers)
    private readonly cohortMembers: Repository<CohortMembers>

    //check for user-tenant relation is valid
    async checkUserTenantValidation(userId: string,tenantId: string){
        const query = `SELECT * FROM "UserTenantMapping" where 
                      "userId" = $1 AND 
                      "tenantId" = $2`;
        const result = await this.UserTenantMapping.query(query, [userId,tenantId]);
        if(result.length > 0)
            return true;
        else
            return false;
    
    }
    //check for user-cohort relation is valid
    async checkUserCohortValidation(userId: string,cohortId: string){
        const query =`SELECT * FROM "CohortMembers" where 
                     "userId" = $1 AND 
                     "cohortId" = $2`;
        const result = await this.cohortMembers.query(query, [userId,cohortId]);
        if(result.length > 0)
            return true;
        else
            return false;
    }
    //check for cohort-tenant relation is valid
    async checkCohortTenantValidation(cohortId: string,tenantId: string){
        const query =`SELECT * FROM "Cohort" where 
                     "cohortId" = $1 AND
                     "tenantId" = $2`;
        const result = await this.UserTenantMapping.query(query, [cohortId,tenantId]);
        if(result.length > 0)
            return true;
        else
            return false;
    }
}