
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PrivilegesDto {
  [key: string]: string[];
}

class RolesDto {
  [key: string]: string[];
}

export class UserPrivilegeRoleDto {
  @ValidateNested()
  @Type(() => PrivilegesDto)
  privileges: PrivilegesDto;

  @ValidateNested()
  @Type(() => RolesDto)
  roles: RolesDto;
}

//sample stub for user privileges and roles
let userPrivilegesAndRoles = {
    "privileges" : {
      "ef99949b-7f3a-4a5f-806a-e67e683e38f3": [
        "users.create",
        "users.delete",
        "users.update",
        "users.read",
        "attendance.read",
        "cohort.create",
        "cohort.read",
        "cohort.delete",
        "cohort.update",
        "cohortmembers.read"
      ]
    },
    "roles": {
      "ef99949b-7f3a-4a5f-806a-e67e683e38f3": [
        "team_leader"
      ]
    }
  }
  

