'use strict';

import { Delete } from '@nestjs/common';
import path from 'path';
import { privilegeCatalog, privilegeGroup } from '../rbac/permission-registry';

/**
 * @file - Sourcing Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-4.1.0
 * @version 1.0
 */

/* create dynamic object
sample input
``
  {
        'get' :  {
    PRIVILEGE_CHECK: ['users.create'], // Specific values for each check
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'], // Specific values for each check
    DATA_TENANT: [],
      DATA_CONTEXT: [],
      DATA_TENANT_CONTEXT: [],
  },
        'patch':  {
    PRIVILEGE_CHECK: ['users.create'], // Specific values for each check
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'] ,// Specific values for each check
      DATA_TENANT_CONTEXT: [],
  },
        'delete':{},
        
        'test':{}
  }
``
sample output from above input
``
{
  method: [ 'get', 'patch', 'delete', 'test' ],
  get: {
    checksNeeded: [
      'PRIVILEGE_CHECK',
      'ROLE_CHECK',
      'DATA_TENANT',
      'DATA_CONTEXT',
      'DATA_TENANT_CONTEXT'
    ],
    PRIVILEGE_CHECK: [ 'users.create' ],
    ROLE_CHECK: [ 'teacher', 'admin', 'team_leader' ],
    DATA_TENANT: [],
    DATA_CONTEXT: [],
    DATA_TENANT_CONTEXT: []
  },
  patch: {
    checksNeeded: [ 'PRIVILEGE_CHECK', 'ROLE_CHECK', 'DATA_TENANT_CONTEXT' ],
    PRIVILEGE_CHECK: [ 'users.create' ],
    ROLE_CHECK: [ 'teacher', 'admin', 'team_leader' ],
    DATA_TENANT_CONTEXT: []
  },
  delete: { checksNeeded: [] },
  test: { checksNeeded: [] }
}
``
 */
const rolesGroup = {
  common: ['admin', 'regional_admin', 'student', 'alp_program_admin'],
  regional_admin: ['regional_admin'],
  student: ['student'],
  // Added alp_program_admin role to superadmin group for testing purpose, will be removed once alp_program_admin role is added to the user_roles_mapping table
  superadmin: ['admin', 'alp_program_admin'],
  superadmin_regional_admin: ['admin', 'regional_admin', 'alp_program_admin'],
  student_regional_admin: ['student', 'regional_admin', 'alp_program_admin'],
  superadmin_regional_admin_student: [
    'admin',
    'regional_admin',
    'student',
    'alp_program_admin',
  ],
  superadmin_student: ['admin', 'student', 'alp_program_admin'],
};
// Permission codes now live in the canonical registry so `apiConfig.ts` and the
// `Privileges` table cannot drift undetected. See `common/rbac/permission-registry.ts`
// and `npm run rbac:drift`. Shape is unchanged, so route entries below are untouched.
const common_public_get = { get: {} };
const common_role_check = {
  ROLE_CHECK: rolesGroup.superadmin,
};
const createRouteObject = (
  methods: any,
  redirectUrl: string | null = null,
  changeResponse: boolean | null = false,
) => {
  const allMethods = Object.keys(methods); // Extract method names (e.g., 'get', 'patch', 'delete')

  const methodObject = allMethods.reduce((acc, method) => {
    const checks = methods[method];
    const checksNeeded = Object.keys(checks); // Extract check keys for each method

    acc[method] = {
      checksNeeded: checksNeeded, // Add checksNeeded for each method
      ...checks, // Spread the original checks object for each method
    };

    return acc;
  }, {});
  return {
    method: allMethods,
    ...methodObject,
    redirectUrl, // Optionally include redirectUrl if it's passed
    changeResponse, // Optionally include changeResponse if it's passed
  };
};

/**
 * The frontend fetches this right after login and whenever the tenant changes, and
 * decodes the returned token to populate the privileges that drive menu visibility.
 * The middleware refreshes its own privilege cache on this same request, so both
 * sides re-read the database at the same moment and cannot diverge.
 */
export const RBAC_TOKEN_PATH = '/user/v1/auth/rbac/token';

export const apiList = {
  //LMS Service API
  '/lms-service/v1/courses': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/courses/search': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      // PRIVILEGE_CHECK passes if the user holds ANY listed code, so accepting the
      // catalog code alongside the legacy one lets alp_program_admin (which holds
      // modulemgmt.modules.view but no lms.* privilege) through without having to
      // re-seed RolePrivilegesMapping first.
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.bulkimport.assessment.view,
        ...privilegeCatalog.bulkimport.certificate.view,
        ...privilegeCatalog.bulkimport.discord.view,
        ...privilegeCatalog.bulkimport.eventattendance.view,
        ...privilegeCatalog.report.alumni_assessment.view,
        ...privilegeCatalog.report.alumni_content.view,
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.participant_content.view,
        ...privilegeCatalog.report.participant_masterclass.view,
        ...privilegeCatalog.alumni.discordimport.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
  }),
  '/lms-service/v1/course/aggregate-content': createRouteObject({
    post: {
       PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.participant_completion_criteria_report.view,
        ...privilegeCatalog.report.participant_masterclass.view,
            ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/lms-service/v1/course/aggregate-course': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/lms-service/v1/courses/:courseId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.report.alumni_exporthistory.view,
        ...privilegeCatalog.report.participant_exporthistory.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.update,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/courses/:courseId/hierarchy': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
  }),
  '/lms-service/v1/courses/next-id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/enrollments/users-courses': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/courses/:courseId/hierarchy/tracking/:userId':
    createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.common,
        PRIVILEGE_CHECK: privilegeGroup.lms.read,
      },
    }),
  '/lms-service/v1/courses/:courseId/structure': createRouteObject({
    put: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.update,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/courses/order/structure': createRouteObject({
    put: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.update,
    },
  }),
  '/lms-service/v1/courses/:courseId/clone': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/modules/:moduleId/clone': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/lessons/:lessonId/clone': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
    },
  }),
  '/lms-service/v1/storage/files/copy': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.create,
    },
  }),
  '/lms-service/v1/storage/files': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/assessment/v1/storage/files': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.delete,
    },
  }),
  '/assessment/v1/tests/:id/question-answer-report': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/lms-service/v1/course/report': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
    '/lms-service/v1/modules/search': createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.common,
        PRIVILEGE_CHECK: privilegeGroup.lms.read,
      },
    }),
  }),

  // Modules API
  '/lms-service/v1/modules': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/modules/:moduleId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.report.alumni_assessment.view,
        ...privilegeCatalog.report.alumni_content.view,
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.participant_content.view,
        ...privilegeCatalog.report.participant_masterclass.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.update,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/modules/course/:courseId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),

  // Lessons API
  '/lms-service/v1/lessons': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.bulkimport.assessment.view,
        ...privilegeCatalog.bulkimport.eventattendance.view,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
  }),
  '/lms-service/v1/lessons/:lessonId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.report.alumni_exporthistory.view,
        ...privilegeCatalog.report.participant_exporthistory.view,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.update,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/lessons/:lessonId/display': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/lessons/course/:courseId/module/:moduleId':
    createRouteObject({
      post: {
        ROLE_CHECK: rolesGroup.superadmin,
        PRIVILEGE_CHECK: privilegeGroup.lms.create,
      },
    }),
  '/lms-service/v1/lessons/module/:moduleId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.read,
        ...privilegeCatalog.report.alumni_assessment.view,
        ...privilegeCatalog.report.alumni_content.view,
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.participant_content.view,
        ...privilegeCatalog.report.participant_masterclass.view,
      ],
    },
  }),
  '/lms-service/v1/lessons/test/:testId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),

  // Enrollments API
  '/lms-service/v1/enrollments': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.create,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.delete,
    },
  }),
  '/lms-service/v1/enrollments/cohort': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
    },
  }),
  '/lms-service/v1/enrollments/:enrollmentId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.update,
    },
  }),

  // Media API
  '/lms-service/v1/media/upload': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),
  '/lms-service/v1/media': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/media/:mediaId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),

  '/lms-service/v1/media/:mediaId/associate/:lessonId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.delete,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.edit,
      ],
    },
  }),

  // Tracking API
  '/lms-service/v1/tracking/recalculate-progress': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/lms-service/v1/tracking/recalculate-progress/jobs': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/lms-service/v1/tracking/userjourney': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/lms-service/v1/tracking/course/:courseId/:userId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/tracking/lesson/attempt/:lessonId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/tracking/lesson/attempt/:lessonId/:userId':
    createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.common,
        PRIVILEGE_CHECK: privilegeGroup.lms.read,
      },
    }),
  '/lms-service/v1/tracking/:lessonId/users/:userId/status': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/tracking/attempts/progress/:attemptId': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.update,
    },
  }),
  '/lms-service/v1/tracking/attempts/:attemptId/:userId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),

  // Tenant level config for lms
  '/lms-service/v1/config/sync': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.read,
    },
  }),
  '/lms-service/v1/config': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
  }),

  //storage presign url
  '/lms-service/v1/storage/presigned-url': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeGroup.lms.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.pathway.view,
      ],
    },
  }),

  '/lms-service/v1/course/tracking/update_test_progress': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.lms.update,
    },
  }),

  //Tenant-Level Configuration
  '/user/v1/tenant/:tenantId/configs': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/tenant/:tenantId/configs/:context': createRouteObject({
    get: {},
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  //Assessment Service API
  // Health Module
  '/assessment/v1/health': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),

  // Questions Module
  '/assessment/v1/questions': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/questions/associate-option': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/questions/disassociate-option': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/questions/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  // Attempts Module
  '/assessment/v1/attempts/start/:testId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),

  '/assessment/v1/attempts/import/resultstatus': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/answers': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/submit': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/review': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/resume/:userId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/answersheet': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/assessment/:attemptId/ai-feedback-status': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/assessment/:attemptId/ai-feedback': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/assessment/:attemptId/ai-feedback/retry': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/attempts/:attemptId/feedback-viewed': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/assessment/:attemptId/ai-feedback/:attemptAnsId/rating':
    createRouteObject({
      put: {
        ROLE_CHECK: rolesGroup.common,
      },
    }),
  '/assessment/v1/file/upload': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/file/download-url': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.tools.s3download.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/file/delete': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // Tests Module
  '/assessment/v1/tests': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.feedback.view,
        ...privilegeCatalog.alumni.feedback.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.feedback.view,
        ...privilegeCatalog.alumni.feedback.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // Static route must be before the dynamic route /tests/:id
  '/assessment/v1/tests/listsearch': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/tests/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:testId/question/:questionId': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:id/hierarchy': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.assessment.view,
        ...privilegeCatalog.bulkimport.assessment.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/tests/:id/test-hierarchy': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:id/questions': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:id/questions/bulk': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:testId/users/:userId/status': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/tests/:testId/users/:userId/result': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/tests/:testId/structure': createRouteObject({
    put: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/tests/:testId/clone': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  '/assessment/v1/questions/:id/child-questions': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // Sections Module
  '/assessment/v1/sections': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/sections/test/:testId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/assessment/v1/sections/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  //storage presign url
  '/assessment/v1/storage/presigned-url': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  // Tenant level config for assessment
  '/assessment/v1/config/sync': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/assessment/v1/config': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  //referral API
  '/user/v1/referrals': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.tracking.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  // Listed by both the Referral Tracking page and the Referral report page.
  '/user/v1/referrals/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.tracking.view,
        ...privilegeCatalog.referral.report.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/resolve': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/import': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/bulk': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/report/summary': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/report': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/referrals/:id': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.tracking.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.tracking.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  // Referral bulk CSV import (aspire-specific-service)
  '/aspirespecific/import-users/referrals/upload': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.import.view,
        ...privilegeCatalog.referral.import.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/bulk-issue/upload': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.certificate.view,
        ...privilegeCatalog.bulkimport.certificate.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/referrals/status/:jobId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.importhistory.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //Certificate Genration API
  '/aspirespecific/certificate/cron/trigger': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/certificate/generate': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/template': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.credential.manage.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/templates-list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.credential.manage.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/course-template/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/aspirespecific/certificate/edit-template': createRouteObject({
    put: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.credential.manage.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/get-template': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.credential.manage.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/course-template': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/generateDid': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/issue': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/regenerate': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.credential.manage.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/aspirespecific/certificate/user/:userId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.credential.manage.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/aspirespecific/certificate/render-PDF': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/aspirespecific/certificate/render': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/aspirespecific/certificate/schema': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/certificate/user-certificates': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/aspirespecific/certificate/url': createRouteObject({
    post: {},
  }),
  //bulk discord upload
  '/aspirespecific/import-users/discord/upload': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.discord.edit,
        ...privilegeCatalog.alumni.discordimport.edit,
        ...privilegeCatalog.alumni.discordimport.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/discord/get-link': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  //Bulk import and kafka API
  '/user/v1/bulk-import/xlsx-template': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.application.view,
        ...privilegeCatalog.bulkimport.application.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),

  '/aspirespecific/import-users/upload': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.application.view,
        ...privilegeCatalog.bulkimport.application.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/import-jobs/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.history.view,
        ...privilegeCatalog.alumni.importhistory.view,
        ...privilegeCatalog.referral.importhistory.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/import-jobs/:import_job_id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/import-jobs': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/import-users/import-jobs/:import_job_id/failures':
    createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      },
    }),
  '/aspirespecific/import-users/import-jobs/:import_job_id/failure-analysis':
    createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      },
    }),

  '/aspirespecific/import-users/assessment/upload': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.assessment.view,
        ...privilegeCatalog.bulkimport.assessment.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/aspirespecific/export/course': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/assessment': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.alumni_assessment.view,
        ...privilegeCatalog.report.alumni_interest.view,
        ...privilegeCatalog.report.alumni_omfeedback.view,
        ...privilegeCatalog.report.alumni_longitudinal.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/content': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_content.view,
        ...privilegeCatalog.report.alumni_content.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/course-progress': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
              ...privilegeCatalog.report.participant_course_progress.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/application': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_application.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/jobs': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_exporthistory.view,
        ...privilegeCatalog.report.alumni_exporthistory.view,
        ...privilegeCatalog.referral.exporthistory.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/jobs/:export_job_id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/event': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_masterclass.view,
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.alumni_openmasterclass.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/event-assessment': createRouteObject({
    post: {
       PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_completion_criteria_report.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/pathway': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.alumni_pathway.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/referrals': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.referral.report.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/aspirespecific/export/volunteer-report': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.alumni_pathway.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //elasticsearch API
  '/user/v1/elasticsearch/users/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.report.participant_application.view,
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.participant_content.view,
        ...privilegeCatalog.report.participant_masterclass.view,
        ...privilegeCatalog.report.alumni_content.view,
        ...privilegeCatalog.report.alumni_assessment.view,
        ...privilegeCatalog.report.alumni_interest.view,
        ...privilegeCatalog.report.alumni_omfeedback.view,
        ...privilegeCatalog.report.alumni_longitudinal.view,
        ...privilegeCatalog.report.alumni_masterclass.view,
        ...privilegeCatalog.report.alumni_openmasterclass.view,
        ...privilegeCatalog.report.alumni_pathway.view,
        ...privilegeCatalog.usermgmt.cohortstudents.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //Opportunity Service API
  '/opportunity-service/opportunities': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.create,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/opportunities/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    put: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/opportunities/:id/archive': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),

  '/opportunity-service/skills': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/skills/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/categories': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/categories/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/organizations': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/organizations/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/locations': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/benefits': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/benefits/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/locations/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/locations/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/opportunity-applications/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    put: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/opportunity-applications': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  '/opportunity-service/opportunity-applications/opportunity/list':
    createRouteObject({
      get: {
        ROLE_CHECK: rolesGroup.superadmin,
        PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
      },
    }),
  '/opportunity-service/opportunity-applications/:id/archive':
    createRouteObject({
      patch: {
        ROLE_CHECK: rolesGroup.superadmin,
        PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
      },
    }),
  '/opportunity-service/application-statuses': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: privilegeGroup.opportunity.read,
    },
  }),
  //tenant api
  '/user/v1/tenant/read': createRouteObject({
    get: {},
  }),
  //tenant Search API
  '/user/v1/tenant/search': createRouteObject({
    post: {},
  }),
  //public api
  '/user/v1/auth/login': createRouteObject({
    post: {},
  }),
  '/user/v1/auth/logout': createRouteObject({
    post: {},
  }),
  '/user/v1/payments/webhook/stripe': createRouteObject({
    post: {},
  }),
  '/assessment/v1/ai-feedback/devrev/webhook': createRouteObject({
    post: {},
  }),
  '/user/v1/cohort/search': createRouteObject({
    post: {},
  }),
  //public api
  '/prathamservice/v1/import-user': createRouteObject({
    post: {},
  }),
  //public api for run cron job for send event notification
  '/prathamservice/v1/cronjob': createRouteObject({
    get: {},
  }),
  // Public api for run cron job for evaluate shortlisting for student - Aspire Leaders
  '/user/v1/cohortmember/cron/evaluate-shortlisting-status': createRouteObject({
    post: {},
  }),
  // Public api for run cron job for evaluate shortlisting for student - Aspire Leaders
  '/user/v1/cohortmember/cron/send-rejection-emails': createRouteObject({
    post: {},
  }),
  '/user/v1/cohortmember/cron/send-shortlisting-emails': createRouteObject({
    post: {},
  }),
  //user-service
  '/user/v1/auth': createRouteObject(common_public_get),
  //Need confirmation in to self registration
  '/user/v1/create': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.create,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/read/:userId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.users.read,
        ...privilegeCatalog.bulkimport.history.view,
        ...privilegeCatalog.cohort.list.view,
        ...privilegeCatalog.modulemgmt.modules.view,
        ...privilegeCatalog.report.alumni_exporthistory.view,
        ...privilegeCatalog.report.participant_exporthistory.view,
        ...privilegeCatalog.usermgmt.applicants.view,
        ...privilegeCatalog.usermgmt.cohortstudents.view,
        ...privilegeCatalog.usermgmt.regionaladmin.view,
        ...privilegeCatalog.alumni.importhistory.view,
        ...privilegeCatalog.payment.transactions.view,
        ...privilegeCatalog.payment.coupons.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/sso-synch': createRouteObject({
    post: {},
  }),
  '/user/v1/sso-callback': createRouteObject({
    get: {},
  }),
  '/user/v1/update/:userId': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.users.update,
        ...privilegeCatalog.usermgmt.applicants.edit,
        ...privilegeCatalog.usermgmt.cohortstudents.edit,
        ...privilegeCatalog.usermgmt.regionaladmin.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin.concat(
        rolesGroup.student,
      ),
    },
  }),
  '/user/v1/delete/:userId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.users.delete,
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  // GDPR-style anonymization of one or more users (by email). Admin-only; the user
  // service additionally re-checks the 'admin' role for the tenantid header.
  '/user/v1/anonymize': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.usermgmt.applicants.view,
        ...privilegeCatalog.usermgmt.applicants.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.users.read,
        ...privilegeCatalog.usermgmt.applicants.view,
        ...privilegeCatalog.usermgmt.regionaladmin.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  //need confirmation
  '/user/v1/password-reset-link': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.delete,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/password-reset-otp': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.delete,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //need confirmation
  '/user/v1/forgot-password': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.delete,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //all
  '/user/v1/reset-password': createRouteObject({
    post: {
      checksNeeded: [],
    },
  }),
  '/user/v1/check': createRouteObject({
    post: {},
  }),
  '/user/v1/suggestUsername': createRouteObject({
    post: {},
  }),
  '/user/v1/auth/refresh': createRouteObject({
    post: {},
  }),
  //cohort
  '/user/v1/cohort/cohortHierarchy/:cohortId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.read,
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/cohort/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohort.create,
        ...privilegeCatalog.cohort.list.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/cohort/update/:cohortId': createRouteObject({
    put: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohort.update,
        ...privilegeCatalog.cohort.list.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/cohort/delete/:cohortId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.delete,
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/cohort/mycohorts/:userId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.read,
      ROLE_CHECK: rolesGroup.superadmin.concat(rolesGroup.student),
    },
  }),
  //cohort member
  '/user/v1/cohortmember/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohortmembers.create,
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/cohortmember/read/:cohortId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.read,
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/cohortmember/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohortmembers.read,
        ...privilegeCatalog.modulemgmt.modules.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/cohortmember/list-application': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohortmembers.read,
        ...privilegeCatalog.usermgmt.cohortstudents.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/cohortmember/update/:cohortmembershipid': createRouteObject({
    put: {
      PRIVILEGE_CHECK: [
        ...privilegeGroup.cohortmembers.update,
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.usermgmt.cohortstudents.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_student,
    },
  }),
  '/user/v1/cohortmember/delete/:id': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.delete,
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/cohortmember/bulkCreate': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.create,
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  // Aspire Leaders-specific reporting endpoint (see
  // docs/regional-admin-cohort-country-report.md): called server-to-server by
  // LMS/Assessment/Event/Referral report handlers, forwarding the original admin's
  // auth context. Admin/Regional Admin only - the endpoint itself resolves role and,
  // for Regional Admins, applies automatic country filtering server-side.
  '/user/v1/cohortmember/report-filter': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.read,
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //Create Interest
  '/user/v1/interest/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //Update Interest
  '/user/v1/interest/update/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //Delete Interest
  '/user/v1/interest/delete/:id': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //List Interest
  '/user/v1/interest/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.pathway.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/interest/pathway/saveuserinterests': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/assign': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/active': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  //get interset of the users by  PathuserPathwayHistoryIdwayhistory id
  '/user/v1/pathway/interests/:userPathwayHistoryId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/list-pathway-users': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.pathway.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.pathway.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // Volunteer pathway endpoints
  '/user/v1/pathway/volunteer/check-eligibility': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/volunteer/active/:userId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/course-completed': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/history/:id/status': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/:id/active-course': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/:id': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.pathway.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/update/:id': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.pathway.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/order/structure': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/config': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/storage/presigned-url': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/pathway/storage/files': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // Tag endpoints
  '/user/v1/tag/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.tags.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/tag/update/:id': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.tags.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/tag/delete/:id': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.tags.edit,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/tag/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.tags.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/tag/fetch/:id': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.tags.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/cache/clear': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),

  //Content
  '/user/v1/content/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/content/update/:id': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.pagemgmt.pages.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/content/list': createRouteObject({
    post: {},
  }),

  //AssignTenant
  '/user/v1/assign-tenant': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //rbac
  '/user/v1/rbac/roles/read/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/roles/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/roles/update/:id': createRouteObject({
    put: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/roles/list/roles': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.rbac.roles.view,
        ...privilegeCatalog.usermgmt.regionaladmin.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/roles/delete/:roleId': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/privileges': createRouteObject({
    get: {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  // add create first
  '/user/v1/rbac/privileges/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/privileges/:privilegeId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/privileges/registry/grouped': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  // Deliberately declares no ROLE_CHECK/PRIVILEGE_CHECK: every authenticated role
  // (students included) must be able to fetch its own RBAC token. It is NOT in
  // `publicAPI`, because the JWT guard has to run to establish a verified userId —
  // that is what lets the middleware refresh the privilege cache here. See
  // RBAC_TOKEN_PATH in middleware.service.ts.
  [RBAC_TOKEN_PATH]: createRouteObject({
    get: {},
  }),
  '/user/v1/rbac/usersRoles': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/rbac/usersRoles/:userId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/assignprivilege': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/assignprivilege/:roleId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.rbac.roles.view
      ],
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.rbac.roles.view
      ],
    },
  }),
  '/user/v1/assignprivilege/:roleId/grouped': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.rbac.roles.view
      ],
    },
  }),
  '/user/v1/assignprivilege/:roleId/:privilegeId': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.rbac.roles.view
      ],
    },
  }),
  '/user/v1/tenant/create': createRouteObject({
    post: {},
  }),
  '/user/v1/tenant/update/:tenantId': createRouteObject({
    patch: {},
  }),
  '/user/v1/tenant/delete/:identifier': createRouteObject({
    post: {},
  }),
  '/user/v1/academicyears/create': createRouteObject({
    post: {},
  }),
  '/user/v1/academicyears/list': createRouteObject({
    post: {},
  }),
  '/user/v1/academicyears/:identifier': createRouteObject(common_public_get),
  '/user/v1/forms/submissions': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_student,
    },
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/forms/submissions/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.usermgmt.cohortstudents.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/forms/submissions/:identifier': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
    put: {
      ROLE_CHECK: rolesGroup.superadmin_student,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/forms/submissions/elasticsearch/sync/:userId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin_student,
    },
  }),
  '/user/v1/form/copy': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
       PRIVILEGE_CHECK: [
        ...privilegeCatalog.cohort.list.edit,
      ],
    },
  }),
  '/user/v1/form/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/form/update/:formId': createRouteObject({
    patch: {
       PRIVILEGE_CHECK: [
        ...privilegeCatalog.cohort.list.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/form/read': createRouteObject(common_public_get),
  '/user/v1/fields/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/fields/options/read': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/options/delete/:identifier': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/fields/delete': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/fields/update/:identifier': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/user/v1/fields/formfields': createRouteObject({
    get: {},
  }),
  '/user/v1/fields/search': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/values/delete': createRouteObject({
    delete: {},
  }),
  '/user/v1/fields/upload/:id': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/presigned-url/:id': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/verify-upload/:id': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/upload-complete/:id': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/delete-file/:id': createRouteObject({
    delete: {},
  }),
  '/user/v1/fields/download-file/:id': createRouteObject({
    get: {},
  }),
  '/user/v1/payments/initiate': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/payments/:id/status': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/coupons/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.transactions.view,
        ...privilegeCatalog.payment.coupons.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/coupons': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.coupons.edit,
      ],
    },
  }),
  '/user/v1/coupons/validate': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/coupons/:id/sync-stripe': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/coupons/code/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.transactions.view,
        ...privilegeCatalog.payment.coupons.view,
        ...privilegeCatalog.payment.coupons.edit,
      ],
    },
  }),
  '/user/v1/payments/report/:id': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.transactions.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/coupons/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.coupons.edit,
      ],
    },
  }),
  '/user/v1/coupons/archive/:id': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/country/list': createRouteObject({
    post: {
       PRIVILEGE_CHECK: [
        ...privilegeCatalog.payment.coupons.view,
        ...privilegeCatalog.notification.inapp.view,
        ...privilegeCatalog.usermgmt.cohortstudents.view,
        ...privilegeCatalog.usermgmt.applicants.view,
        ...privilegeCatalog.usermgmt.regionaladmin.view,
        ...privilegeCatalog.report.participant_masterclass.view,
        ...privilegeCatalog.report.participant_application.view,
        ...privilegeCatalog.report.participant_assessment.view,
        ...privilegeCatalog.report.participant_course_progress.view,
        ...privilegeCatalog.report.participant_completion_criteria_report.view,
        ...privilegeCatalog.referral.tracking.view,
        ...privilegeCatalog.referral.report.view
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/user/v1/payments/transactions/:id/status/override': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/user/v1/payments/by-session': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  //event-service
  //event
  '/event-service/config': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/storage/presigned-url': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/storage/files': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendance/v1/mark-attendance-by-userId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendance/v1/bulk-import': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.eventattendance.view,
        ...privilegeCatalog.bulkimport.eventattendance.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendance/v1/bulk-import/status': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.bulkimport.history.view,
      ],
    },
  }),
  '/event-service/event/v1/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.events.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/event/v1/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.events.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/event-service/event/v1/search': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/event-service/event/v1/event/:eventId': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.events.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  //event-attendance
  '/event-service/attendance/v1/markeventattendance': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendance/v1/status/:jobId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendance/v1/jobs': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendees/v1/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendees/v1/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/event-service/attendees/v1': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  //EVENT MICROSERVICE API

  '/event-service/event/v1/:eventId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.events.edit,
        ...privilegeCatalog.modulemgmt.modules.view,
      ],
      ROLE_CHECK: rolesGroup.common,
    },
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.alumni.events.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
    delete: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
        ...privilegeCatalog.alumni.events.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  '/event-service/event/v1/repetition/:repetitionId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),

  '/event-service/attendees/v1/enroll': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
    delete: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),

  '/event-service/attendees/v1/:eventRepetitionId/:userId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),

  '/event-service/attendance/v1/mark-attendance': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.modulemgmt.modules.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),

  '/event-service/reports/attendance': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),

  //END EVENT MICROSERVICE API

  //notification-service
  //notification templates
  '/notification-templates': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/notification-templates/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.notification.templates.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/notification-templates/action/:id': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.notification.templates.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
    get: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.notification.templates.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/notification-templates/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //notification-send
  '/notification/send': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/notification/sendTopicNotification': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/notifications/in-app': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/notifications/in-app/unread-count': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/notifications/in-app/read': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/notification/public/in-app': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.notification.inapp.edit,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  '/notifications/in-app/admin/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: [
        ...privilegeCatalog.notification.inapp.view,
      ],
      ROLE_CHECK: rolesGroup.superadmin,
    },
  }),
  //notification-queue
  '/queue': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/queue/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/queue/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId': createRouteObject({
    get: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/create': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.create,
      ROLE_CHECK: rolesGroup.student,
    },
  }),
  '/v1/tracking/assessment/search': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/search/status': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/list': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/delete/:assessmentTrackingId': createRouteObject({
    delete: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.delete,
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  //tracking-content
  '/v1/tracking/content/read/:contentTrackingId': createRouteObject({
    get: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/create': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.create,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/search': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/search/status': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/list': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/delete/:contentTrackingId': createRouteObject({
    delete: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.delete,
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/v1/tracking/content/course/status': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/unit/status': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/course/inprogress': createRouteObject({
    post: {
      //PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  // todos
  '/todo/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),
  '/todo/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/todo/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.common,
    },
    patch: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
    delete: {
      ROLE_CHECK: rolesGroup.superadmin_regional_admin,
    },
  }),

  //OTP
  '/user/v1/send-otp': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.delete,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/verify-otp': createRouteObject({
    post: {
      // PRIVILEGE_CHECK: privilegeGroup.users.delete,
      // ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),

  //sunbird knowlg and inQuiry service
  //public

  '/api/question/v2/list': createRouteObject({ post: {} }, '/question/v5/list'),

  '/action/question/v2/list': createRouteObject(
    { post: {} },
    '/question/v5/list',
  ),
  '/action/question/v2/private/read/:identifier': createRouteObject(
    common_public_get,
    '/question/v5/private/read/:identifier',
  ),

  '/action/questionset/v2/read/:identifier': createRouteObject(
    common_public_get,
    '/questionset/v5/read/:identifier',
  ),

  '/action/questionset/v2/hierarchy/:identifier': createRouteObject(
    common_public_get,
    '/questionset/v5/hierarchy/:identifier',
  ),
  '/action/questionset/v2/comment/read/:identifier': createRouteObject(
    common_public_get,
    '/questionset/v5/comment/read/:identifier',
  ),
  '/api/channel/v1/read/:identifier': createRouteObject(
    common_public_get,
    '/channel/v3/read/:identifier',
  ),
  '/api/framework/v1/read/:identifier': createRouteObject(
    common_public_get,
    '/framework/v3/read/:identifier',
  ),
  '/action/question/v2/read/:identifier': createRouteObject(
    common_public_get,
    '/question/v5/read/:identifier',
  ),
  '/action/asset/v1/read/:identifier': createRouteObject(
    common_public_get,
    '/asset/v4/read/:identifier',
  ),
  '/action/content/v3/read/:identifier': createRouteObject(
    common_public_get,
    '/content/v3/read/:identifier',
  ),
  '/api/content/v1/read/:identifier': createRouteObject(
    common_public_get,
    '/content/v3/read/:identifier',
  ),
  '/action/questionset/private/v2/read/:identifier': createRouteObject(
    common_public_get,
    '/questionset/v5/private/read/:identifier',
  ),
  //secure

  '/action/composite/v3/search': createRouteObject(
    {
      post: {},
    },
    '/v3/search',
  ),
  '/action/object/category/definition/v1/read': createRouteObject(
    {
      post: {},
    },
    '/object/category/definition/v4/read',
  ),

  '/api/course/v1/hierarchy/:identifier': createRouteObject(
    common_public_get,
    '/content/v3/hierarchy/:identifier',
  ),
  '/action/license/v3/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/license/v3/create',
  ),
  '/action/license/v3/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/license/v3/read/:identifier',
  ),
  '/action/license/v3/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/license/v3/update/:identifier',
  ),
  '/action/license/v3/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/license/v3/retire/:identifier',
  ),

  //channel API
  '/api/channel/v1/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/channel/v3/create',
  ),
  '/api/channel/v1/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/channel/v3/update/:identifier',
  ),
  '/api/channel/v1/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/channel/v3/retire/:identifier',
  ),

  //framework API
  '/api/framework/v1/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/create',
  ),
  '/api/framework/v1/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/framework/v3/update/:identifier',
  ),
  '/api/framework/v1/list': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/list',
  ),
  '/api/framework/v1/copy/:identifier': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/copy/',
  ),
  '/api/framework/v1/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/framework/v3/retire/:identifier',
  ),
  '/api/framework/v1/publish/:identifier': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/publish/:identifier',
  ),
  '/api/framework/v1/category/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/create',
  ),
  '/api/framework/v1/category/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/read/:identifier',
  ),
  '/api/framework/v1/category/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/update/:identifier',
  ),

  '/api/framework/v1/category/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/retire/:identifier',
  ),
  '/api/framework/v1/category/master/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/master/create',
  ),
  '/api/framework/v1/category/master/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/master/update/:identifier',
  ),
  '/api/framework/v1/category/master/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/master/read/:identifier',
  ),
  '/api/framework/v1/category/master/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/framework/v3/category/master/retire/:identifier',
  ),

  '/api/framework/v1/term/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/framework/v3/term/create',
  ),
  '/api/framework/v1/term/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/framework/v3/term/read/:identifier',
  ),
  '/api/framework/v1/term/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/framework/v3/term/update/:identifier',
  ),
  '/api/framework/v1/term/retire/:identifier': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/framework/v3/term/retire/:identifier',
  ),
  //Object API
  '/api/object/category/v1/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/object/category/v4/create',
  ),
  '/api/object/category/v1/update': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/object/category/v4/update',
  ),
  '/api/object/category/v1/read': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/object/category/v4/read',
  ),
  '/api/object/category/v1/retire': createRouteObject(
    {
      delete: {
        ...common_role_check,
      },
    },
    '/object/category/v4/retire',
  ),
  '/api/object/category/definition/v1/create': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/create',
  ),
  '/api/object/category/definition/v1/update': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/update',
  ),
  '/api/object/category/definition/v1/update/:identifier': createRouteObject(
    {
      patch: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/update/:identifier',
  ),
  '/api/object/category/definition/v1/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/read/:identifier',
  ),
};
export const urlPatterns = Object.keys(apiList);

//add public api
export const publicAPI = [
  // Served by RbacCacheController in this service, not proxied. Authenticated by
  // the INTERNAL_API_KEY shared secret rather than a user JWT, since the caller is
  // the user service and has no user context.
  '/internal/rbac/cache/invalidate',
  '/metrics', // Prometheus metrics endpoint - must be public for scraping
  '/health', // Health check endpoint - must be public for monitoring
  '/health/live', // Liveness probe - must be public for Kubernetes
  '/health/ready', // Readiness probe - must be public for Kubernetes
  '/user/v1/auth',
  '/user/v1/create',
  '/user/v1/fields/options/read',
  '/user/v1/tenant/read',
  '/user/v1/tenant/create',
  '/user/v1/tenant/search',
  '/user/v1/tenant/update/:tenantId',
  '/user/v1/tenant/delete/:identifier',
  '/user/v1/auth/login',
  '/user/v1/auth',
  '/api/question/v2/list',
  '/action/question/v2/list',
  '/action/question/v2/private/read/:identifier',
  '/action/questionset/v2/read/:identifier',
  '/action/questionset/v2/hierarchy/:identifier',
  '/action/questionset/v2/comment/read/:identifier',
  '/api/channel/v1/read/:identifier',
  '/api/framework/v1/read/:identifier',
  '/action/question/v2/read/:identifier',
  '/action/questionset/private/v2/read/:identifier',
  '/action/object/category/definition/v1/read',
  '/user/v1/password-reset-link',
  '/user/v1/password-reset-otp',
  '/user/v1/forgot-password',
  '/user/v1/send-otp',
  '/user/v1/verify-otp',
  '/questionset/v5/private/read/:identifier',
  '/user/v1/form/read',
  '/action/composite/v3/search',
  '/api/content/v1/read/:identifier',
  '/api/course/v1/hierarchy/:identifier',
  '/prathamservice/v1/cronjob',
  '/prathamservice/v1/import-user',
  '/user/v1/fields/options/delete/:identifier',
  '/user/v1/check',
  '/user/v1/suggestUsername',
  '/user/v1/cohort/search',
  '/user/v1/sso-synch',
  '/user/v1/sso-callback',
  '/user/v1/fields/upload/:id',
  '/user/v1/fields/presigned-url/:id',
  '/user/v1/fields/verify-upload/:id',
  '/user/v1/fields/upload-complete/:id',
  '/user/v1/fields/delete-file/:id',
  '/user/v1/fields/download-file/:id',
  '/user/v1/cohortmember/cron/evaluate-shortlisting-status',
  '/user/v1/cohortmember/cron/send-rejection-emails',
  '/user/v1/cohortmember/cron/send-shortlisting-emails',
  '/user/v1/payments/webhook/stripe',
  '/assessment/v1/ai-feedback/devrev/webhook',
  '/aspirespecific/certificate/url',
  '/user/v1/content/list',
];

// api which required academic year
export const apiListForAcademicYear = [
  '/user/v1/cohortmember/list',
  '/user/v1/cohortmember/list-application',
  '/user/v1/cohortmember/bulkCreate',
  '/user/v1/cohortmember/create',
  '/user/v1/cohortmember/read/:identifier',
  '/user/v1/cohort/create',
  '/user/v1/cohort/search',
  '/user/v1/cohort/mycohorts/:identifier',
];

// Webhook endpoints that require raw body preservation for signature verification
// These endpoints need the exact request body (including formatting) to be preserved
export const webhookEndpoints = [
  '/user/v1/payments/webhook/stripe',
  '/assessment/v1/ai-feedback/devrev/webhook',
];

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);
