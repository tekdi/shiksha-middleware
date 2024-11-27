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
  common: [
    'admin',
    'team_leader',
    'teacher',
    'student',
    'learner',
    'state_admin_mme',
    'central_admin_mme',
  ],
  //admin: ['admin'], //state_admin_mme
  central_admin_ccta: ['central_admin_ccta'],
  central_admin_mme: ['central_admin_mme'],
  state_admin_scta: ['state_admin_scta'],
  state_admin_mme: ['state_admin_mme'],
  admin_mme: ['state_admin_mme', 'central_admin_mme'],
  admin_scta_ccta: ['state_admin_scta', 'central_admin_ccta'],
  team_leader: ['team_leader', 'state_admin_mme', 'central_admin_mme'],
  teacher: ['teacher', 'state_admin_mme', 'central_admin_mme'],
  student: ['student', 'learner'],
  admin_team_leader: [
    'admin',
    'team_leader',
    'state_admin_mme',
    'central_admin_mme',
  ],
  admin_team_leader_teacher: [
    'admin',
    'teacher',
    'team_leader',
    'state_admin_mme',
    'central_admin_mme',
  ],
  team_leader_teacher: [
    'teacher',
    'team_leader',
    'state_admin_mme',
    'central_admin_mme',
  ],
  admin_team_leader_teacher_student_state_admin_scta_ccta: [
    'admin',
    'teacher',
    'team_leader',
    'state_admin_mme',
    'central_admin_mme',
    'state_admin_scta',
    'central_admin_ccta',
    'student',
  ],
};
const createPrivilegeGroup = (entity: string) => {
  return {
    create: [`${entity}.create`],
    read: [`${entity}.read`],
    update: [`${entity}.update`],
    delete: [`${entity}.delete`],
    review: [`${entity}.review`],
    approve: [`${entity}.approve`],
    publish: [`${entity}.publish`],
  };
};
const privilegeGroup = {
  tracking: createPrivilegeGroup('tracking'),
  content: createPrivilegeGroup('content'),
  users: createPrivilegeGroup('users'),
  cohort: createPrivilegeGroup('cohort'),
  cohortmembers: createPrivilegeGroup('cohortmembers'),
  attendance: createPrivilegeGroup('attendance'),
  event: createPrivilegeGroup('event'),
};
const common_public_get = { get: {} };
const common_role_check = { ROLE_CHECK: rolesGroup.admin_team_leader };
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

export const apiList = {
  //tenant api
  '/user/v1/tenant/read': createRouteObject({
    get: {},
  }),
  //public api
  '/user/v1/auth/login': createRouteObject({
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
      PRIVILEGE_CHECK: privilegeGroup.users.read,
      ROLE_CHECK:
        rolesGroup.admin_team_leader_teacher_student_state_admin_scta_ccta,
    },
  }),
  '/user/v1/update/:userId': createRouteObject({
    patch: {
      PRIVILEGE_CHECK: privilegeGroup.users.update,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher.concat(
        rolesGroup.student,
      ),
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
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher.concat(
        rolesGroup.student,
      ),
    },
  }),
  //need confirmation
  '/user/v1/password-reset-link': createRouteObject({
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
    post: {
      PRIVILEGE_CHECK: privilegeGroup.users.read,
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher.concat(
        rolesGroup.student,
      ),
    },
  }),
  '/user/v1/auth/refresh': createRouteObject({
    post: {},
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
      ROLE_CHECK: rolesGroup.team_leader_teacher.concat(rolesGroup.student),
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
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohortmember/delete/:id': createRouteObject({
    delete: {
      PRIVILEGE_CHECK: privilegeGroup.cohortmembers.delete,
      ROLE_CHECK: rolesGroup.team_leader_teacher,
    },
  }),
  '/user/v1/cohortmember/bulkCreate': createRouteObject({
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
  // add create first
  '/user/v1/rbac/privileges/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader,
    },
  }),
  '/user/v1/rbac/privileges/:privilegeId': createRouteObject({
    get: {
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
  '/user/v1/academicyears/create': createRouteObject({
    post: {},
  }),
  '/user/v1/academicyears/list': createRouteObject({
    post: {},
  }),
  '/user/v1/academicyears/:identifier': createRouteObject(common_public_get),
  '/user/v1/form/read': createRouteObject(common_public_get),
  '/user/v1/fields/options/read': createRouteObject({
    post: {},
  }),
  '/user/v1/fields/update/:identifier': createRouteObject({
    patch: {},
  }),
  '/user/v1/fields/formfields': createRouteObject({
    get: {},
  }),
  '/user/v1/fields/search': createRouteObject({
    post: {},
  }),
  //event-service
  //event
  '/event-service/event/v1/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
      PRIVILEGE_CHECK: privilegeGroup.event.create,
    },
  }),
  '/event-service/event/v1/list': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.common,
      PRIVILEGE_CHECK: privilegeGroup.event.read,
    },
  }),
  '/event-service/event/v1/:id': createRouteObject({
    patch: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
      PRIVILEGE_CHECK: privilegeGroup.event.update,
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
      ROLE_CHECK: rolesGroup.admin_team_leader,
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
      ROLE_CHECK: rolesGroup.student,
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
      ROLE_CHECK: rolesGroup.admin_team_leader,
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
  // todos
  '/todo/create': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
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
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
    },
    delete: {
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher,
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
  // added update one before any identifier
  '/action/questionset/v2/hierarchy/update': createRouteObject(
    {
      patch: {
        //PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/hierarchy/update',
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
  '/action/questionset/v2/create': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/create',
  ),
  '/action/questionset/v2/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/update/:identifier',
  ),
  '/action/questionset/v2/review/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/review/:identifier',
  ),
  '/action/questionset/v2/publish/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.publish,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/publish/:identifier',
  ),
  '/action/questionset/v2/retire/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/retire/:identifier',
  ),

  '/action/questionset/v2/reject/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/reject/:identifier',
  ),
  '/action/questionset/v2/comment/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/comment/update/:identifier',
  ),
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
  '/action/asset/v1/create': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/create',
  ),
  '/action/asset/v1/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/update/:identifier',
  ),
  '/action/asset/v1/copy/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/copy/:identifier',
  ),
  '/action/asset/v1/upload/url/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/upload/url/:identifier',
  ),
  '/action/asset/v1/upload/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/upload/:identifier',
  ),
  '/action/content/v3/upload/url/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/upload/url/:identifier',
  ),
  '/action/content/v3/copy/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/copy/:identifier',
  ),
  '/action/content/v3/import': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/import',
  ),
  '/action/content/v3/dialcode/link': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/content/v3/dialcode/link',
  ),

  '/action/content/v3/create': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/create',
  ),
  '/action/content/v3/upload/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/upload/:identifier',
  ),
  '/action/content/v3/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/update/:identifier',
  ),
  '/action/content/v3/review/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/review/:identifier',
  ),
  '/action/content/v3/reject/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/reject/:identifier',
  ),
  '/action/content/v3/publish/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.publish,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/publish/:identifier',
  ),
  '/action/content/v3/retire/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/retire/:identifier',
  ),
  '/action/content/v3/hierarchy/add': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/hierarchy/add',
  ),
  '/action/content/v3/hierarchy/update': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/hierarchy/update',
  ),
  '/action/content/v3/hierarchy/remove': createRouteObject(
    {
      delete: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/content/v3/hierarchy/remove',
  ),
  '/action/content/v3/hierarchy/:identifier': createRouteObject(
    {
      get: {
        ROLE_CHECK:
          rolesGroup.admin_team_leader_teacher_student_state_admin_scta_ccta,
      },
    },
    '/content/v3/hierarchy/:identifier',
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

  '/action/asset/v3/validate': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/asset/v4/validate',
    true,
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
  '/api/object/category/definition/v1/read/:identifier': createRouteObject(
    {
      get: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/read/:identifier',
  ),
  '/api/object/category/definition/v1/read': createRouteObject(
    {
      post: {
        ...common_role_check,
      },
    },
    '/object/category/definition/v4/read',
  ),
  '/action/question/v2/create': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/create',
  ),
  '/action/question/v2/update/:identifier': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/update/:identifier',
  ),
  '/action/question/v2/review/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.review,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/review/:identifier',
  ),
  '/action/question/v2/publish/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.publish,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/publish/:identifier',
  ),
  '/action/question/v2/retire/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/retire/:identifier',
  ),
  '/action/question/v2/copy/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/copy/:identifier',
  ),
  '/action/question/v2/reject/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/reject/:identifier',
  ),
  '/action/question/v2/system/update/:identifier': createRouteObject(
    {
      patch: {
        //PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/question/v5/system/update/:identifier',
  ),
  '/action/question/v2/import': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/question/v5/import',
  ),
  '/action/questionset/v2/import': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/import',
  ),
  '/action/questionset/v2/copy/:identifier': createRouteObject(
    {
      post: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/copy/:identifier',
  ),
  '/action/questionset/v2/add': createRouteObject(
    {
      patch: {
        PRIVILEGE_CHECK: privilegeGroup.content.create,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/add',
  ),
  '/action/questionset/v2/remove': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.delete,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/remove',
  ),
  '/action/questionset/v2/system/update/:identifier': createRouteObject(
    {
      delete: {
        PRIVILEGE_CHECK: privilegeGroup.content.update,
        ROLE_CHECK: rolesGroup.admin_scta_ccta,
      },
    },
    '/questionset/v5/system/update/:identifier',
  ),
  //collection framework
  '/action/collection/v1/create': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/create',
  ),
  '/action/collection/v1/update/:identifier': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/update/:identifier',
  ),
  '/action/collection/v1/read/:identifier': createRouteObject(
    {
      get: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/read/:identifier',
  ),
  '/action/collection/v1/private/read/:identifier': createRouteObject(
    {
      get: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/private/read/:identifier',
  ),
  '/action/collection/v1/hierarchy/add': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/hierarchy/add',
  ),
  '/action/collection/v1/hierarchy/remove': createRouteObject(
    {
      delete: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/hierarchy/remove',
  ),
  '/action/collection/v1/hierarchy/update': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/hierarchy/update',
  ),
  '/action/collection/v1/hierarchy/:identifier': createRouteObject(
    {
      get: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/hierarchy/:identifier',
  ),
  '/action/collection/v1/flag/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/flag/:identifier',
  ),
  '/action/collection/v1/flag/accept/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/flag/accept/:identifier',
  ),
  '/action/collection/v1/discard/:identifier': createRouteObject(
    {
      delete: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/discard/:identifier',
  ),
  '/action/collection/v1/retire/:identifier': createRouteObject(
    {
      delete: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/retire/:identifier',
  ),
  '/action/collection/v1/copy/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/copy/:identifier',
  ),
  '/action/collection/v1/system/update/:identifier': createRouteObject(
    {
      patch: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/system/update/:identifier',
  ),
  '/action/collection/v1/reject/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/reject/:identifier',
  ),
  '/action/collection/v1/publish/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/publish/:identifier',
  ),
  '/action/collection/v1/unlisted/publish/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/unlisted/publish/:identifier',
  ),
  '/action/collection/v1/import/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/import/:identifier',
  ),
  '/action/collection/v1/export/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/export/:identifier',
  ),
  '/action/collection/v1/review/:identifier': createRouteObject(
    {
      post: {
        ROLE_CHECK: rolesGroup.admin_team_leader,
      },
    },
    '/collection/v4/review/:identifier',
  ),

  '/api/content/v1/bundle': createRouteObject(
    {
      post: {},
    },
    '/content/v3/bundle',
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
      ROLE_CHECK: rolesGroup.admin_team_leader_teacher.concat(
        rolesGroup.student,
      ),
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
  // Pratham Speicfic Mico-service
  '/prathamservice/v1/course-planner/upload': createRouteObject({
    post: {
      ROLE_CHECK: rolesGroup.admin_scta_ccta,
    },
  }),
};
export const urlPatterns = Object.keys(apiList);

//add public api
export const publicAPI = [
  '/user/v1/auth',
  '/user/v1/create',
  '/user/v1/fields/options/read',
  '/user/v1/tenant/read',
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
  '/user/v1/forgot-password',
  '/questionset/v5/private/read/:identifier',
  '/user/v1/form/read',
  '/action/composite/v3/search',
  '/api/content/v1/read/:identifier',
  '/api/course/v1/hierarchy/:identifier',
  '/prathamservice/v1/cronjob',
  '/prathamservice/v1/import-user'
];

// api which required academic year
export const apiListForAcademicYear = [
  '/user/v1/cohortmember/list',
  '/user/v1/cohortmember/bulkCreate',
  '/user/v1/cohortmember/create',
  '/user/v1/cohortmember/read/:identifier',
  '/user/v1/cohort/create',
  '/user/v1/cohort/search',
  '/user/v1/cohort/mycohorts/:identifier',
];

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);
