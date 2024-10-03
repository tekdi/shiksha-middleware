'use strict';

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
  common: ['admin', 'team_leader', 'teacher', 'student'],
  admin: ['admin'],
  team_leader: ['team_leader'],
  teacher: ['teacher'],
  student: ['student'],
  restricted: ['admin', 'team_leader'],
  content_restricted: ['admin', 'team_leader'],
  admin_team_leader: ['admin', 'team_leader'],
  admin_team_leader_teacher: ['admin', 'teacher', 'team_leader'],
  team_leader_teacher: ['teacher', 'team_leader'],
};
const createPrivilegeGroup = (entity: string) => {
  return {
    create: [`${entity}.create`],
    read: [`${entity}.read`],
    update: [`${entity}.update`],
    delete: [`${entity}.delete`],
    review: [`${entity}.review`],
    approve: [`${entity}.approve`],
  };
};
const privilegeGroup = {
  tracking: createPrivilegeGroup('tracking'),
  content: createPrivilegeGroup('content'),
  users: createPrivilegeGroup('users'),
  cohort: createPrivilegeGroup('cohort'),
  cohortmembers: createPrivilegeGroup('cohortmembers'),
  attendance: createPrivilegeGroup('attendance'),
};
//added common values
const get_with_no_check = { get: {} };
const content_restricted_content_create = {
  post: {
    PRIVILEGE_CHECK: privilegeGroup.content.create,
    ROLE_CHECK: rolesGroup.content_restricted,
  },
};
const createRouteObject = (methods: any, redirectUrl: string | null = null) => {
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
  };
};

export const apiList = {
  //public api
  '/user/v1/auth/login': createRouteObject({
    post: {},
  }),

  //user-service
  '/user/v1/auth': createRouteObject(get_with_no_check),
  '/user/v1/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.create,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/read/:userId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.users.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/update/:userId': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: privilegeGroup.users.update,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/delete/:userId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.users.delete,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //need confirmation
  '/user/v1/password-reset-link': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.delete,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //need confirmation
  '/user/v1/forgot-password': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.delete,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //all
  '/user/v1/reset-password': createRouteObject({
    post: {
      checksNeeded: [],
    },
  }),
  '/user/v1/check': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //cohort
  '/user/v1/cohort/cohortHierarchy/:cohortId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/user/v1/cohort/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.create,
      ROLE_CHECK: rolesGroup.team_leader,
    },
  }),
  '/user/v1/cohort/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.read,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohort/update/:cohortId': createRouteObject({
    put: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.update,
      ROLE_CHECK: rolesGroup.team_leader,
    },
  }),
  '/user/v1/cohort/delete/:cohortId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.delete,
      ROLE_CHECK: rolesGroup.team_leader,
    },
  }),
  '/user/v1/cohort/mycohorts/:userId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohort.read,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  //cohort member
  '/user/v1/cohortmember/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.create,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohortmember/read/:cohortId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.read,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohortmember/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.read,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohortmember/update/:cohortmembershipid': createRouteObject({
    put: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.update,
      ROLE_CHECK: rolesGroup.teacher,
    },
  }),
  '/user/v1/cohortmember/delete/:id': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.delete,
      ROLE_CHECK: rolesGroup.teacher,
    },
  }),
  '/user/v1/cohortmember/bulkcreate': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.create,
      ROLE_CHECK: rolesGroup.teacher,
    },
  }),
  //AssignTenant
  '/user/v1/assign-tenant': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  //rbac
  '/user/v1/rbac/roles/read/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/roles/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/roles/update/:id': createRouteObject({
    put: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/roles/list/roles': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/roles/delete/:roleId': createRouteObject({
    delete: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/privileges': createRouteObject({
    get: {
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),

  '/user/v1/rbac/privileges/:privilegeId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/privileges/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/usersRoles': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/usersRoles/:userId': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/assignprivilege': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/assignprivilege/:roleId': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  //event-service
  //event
  '/event-service/event/v1/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/event-service/event/v1/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/event-service/event/v1/:id': createRouteObject({
    get: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
    patch: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
    delete: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //event-attendance
  '/event-service/attendees/v1/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/event-service/attendees/v1/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/event-service/attendees/v1': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
    delete: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),

  //notification-service
  //notification templates
  '/notification-templates': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/notification-templates/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/notification-templates/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
    delete: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //notification-send
  '/notification/send': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/notification/sendTopicNotification': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  //notification-queue
  '/queue': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/queue/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/queue/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.create,
      ROLE_CHECK: rolesGroup.student,
    },
  }),
  '/v1/tracking/assessment/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/search/status': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/assessment/delete/:assessmentTrackingId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.delete,
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  //tracking-content
  '/v1/tracking/content/read/:contentTrackingId': createRouteObject({
    get: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/create': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.create,
      ROLE_CHECK: rolesGroup.student,
    },
  }),
  '/v1/tracking/content/search': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/search/status': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.read,
      ROLE_CHECK: rolesGroup.common,
    },
  }),
  '/v1/tracking/content/delete/:contentTrackingId': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.tracking.delete,
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),

  //sunbird knowlg and inQuiry service
  //public

  '/api/question/v2/list': createRouteObject({ post: {} }, '/question/v5/list'),
  '/action/questionset/v2/read/:identifier': createRouteObject(
    { get: {} },
    '/questionset/v5/read/:identifier',
  ),
  // added update one before any identifier
  '/action/questionset/v2/hierarchy/update': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/hierarchy/update',
  ),
  '/action/questionset/v2/hierarchy/:identifier': createRouteObject(
    get_with_no_check,
    '/questionset/v5/hierarchy/:identifier',
  ),
  '/action/questionset/v2/comment/read/:identifier': createRouteObject(
    get_with_no_check,
    '/questionset/v5/comment/read/:identifier',
  ),
  '/api/channel/v1/read/:identifier': createRouteObject(
    get_with_no_check,
    '/channel/v3/read/:identifier',
  ),
  '/api/framework/v1/read/:identifier': createRouteObject(
    get_with_no_check,
    '/framework/v3/read/:identifier',
  ),
  '/action/question/v2/read/:identifier': createRouteObject(
    get_with_no_check,
    '/question/v5/read/:identifier',
  ),
  '/action/asset/v1/read/:identifier': createRouteObject(
    get_with_no_check,
    '/asset/v4/read/:identifier',
  ),
  '/action/content/v3/read/:identifier': createRouteObject(
    get_with_no_check,
    '/content/v4/read/:identifier',
  ),
  '/api/content/v1/read/:identifier': createRouteObject(
    get_with_no_check,
    '/content/v4/read/:identifier',
  ),
  //secure
  '/action/questionset/v2/create': createRouteObject(
    content_restricted_content_create,
    '/questionset/v5/create',
  ),
  '/action/questionset/v2/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/update/:identifier',
  ),
  '/action/questionset/v2/review/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/review/:identifier',
  ),
  '/action/questionset/v2/publish/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.approve,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/publish/:identifier',
  ),
  '/action/questionset/v2/retire/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/retire/:identifier',
  ),

  '/action/questionset/v2/reject/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/reject/:identifier',
  ),
  '/action/questionset/v2/comment/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/questionset/v5/comment/update/:identifier',
  ),
  ////////////////////////////////////////////////////
  '/action/composite/v3/search': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.read,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/v3/search',
  ),
  '/action/object/category/definition/v1/read': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.read,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/object/category/definition/v4/read',
  ),
  '/action/asset/v1/create': createRouteObject(
    content_restricted_content_create,
    '/asset/v4/create',
  ),
  '/action/asset/v1/upload/url/:identifier': createRouteObject(
    content_restricted_content_create,
    '/asset/v4/upload/url/:identifier',
  ),
  '/action/asset/v1/upload/:identifier': createRouteObject(
    content_restricted_content_create,
    '/asset/v4/upload/:identifier',
  ),
  '/action/content/v3/upload/url/:identifier': createRouteObject(
    content_restricted_content_create,
    '/content/v3/upload/url/:identifier',
  ),
  '/action/content/v3/create': createRouteObject(
    content_restricted_content_create,
    '/content/v4/create',
  ),
  '/action/content/v3/upload/:identifier': createRouteObject(
    content_restricted_content_create,
    '/content/v4/upload/:identifier',
  ),
  '/action/content/v3/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/content/v4/update/:identifier',
  ),
  '/action/content/v3/review/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/content/v4/review/:identifier',
  ),
  '/action/content/v3/reject/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/content/v4/reject/:identifier',
  ),
  '/action/content/v3/publish/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/content/v4/publish/:identifier',
  ),
  '/action/content/v3/retire/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.content_restricted,
      },
    },
    '/content/v4/retire/:identifier',
  ),

  //attendance service
  '/api/v1/attendance': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.attendance.create,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
      DATA_TENANT: [],
      DATA_CONTEXT: [],
      DATA_TENANT_CONTEXT: [],
    },
  }),
  '/api/v1/attendance/list': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.attendance.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
  }),
  '/api/v1/attendance/bulkAttendance': createRouteObject({
    post: {
      PRIVILEGE_CHECK: privilegeGroup.attendance.create,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
      DATA_TENANT: [],
      DATA_CONTEXT: [],
      DATA_TENANT_CONTEXT: [],
    },
  }),
};
export const urlPatterns = Object.keys(apiList);

//add public api
export const publicAPI = [
  '/user/v1/auth/login',
  '/api/question/v2/list',
  '/action/questionset/v2/read/:identifier',
  '/action/questionset/v2/hierarchy/:identifier',
  '/action/questionset/v2/comment/read/:identifier',
  '/api/channel/v1/read/:identifier',
  '/api/framework/v1/read/:identifier',
  '/action/composite/v3/search',
  '/action/object/category/definition/v1/read',
  '/action/question/v2/read/:identifier',
];

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);
