'use strict';

/**
 * @file - Sourcing Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-4.1.0
 * @version 1.0
 */
export const apiList = {
  //user-service
  '/user/v1/create':
  {
    method: ['post'],
    'post' : {
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/user/v1/read/:userId':
  {
    method: ['get'],
    'get' :{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.read'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/user/v1/update/:userId':
  {
    method: ['patch'],
    'patch':{      
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.update'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/user/v1/delete/:userId':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.delete'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/user/v1/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.read'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //need confirmation
  '/user/v1/password-reset-link':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.delete'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //need confirmation
  '/user/v1/forgot-password':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.delete'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //all
  '/user/v1/reset-password':
  {
    method: ['post'],
    'post':{
      checksNeeded: [],
    }
  },
  '/user/v1/check':
  {
    method:[ 'post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.read'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //cohort
  '/user/v1/cohort/cohortHierarchy/:cohortId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['"cohort.read"'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/user/v1/cohort/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohort.create'],
      ROLE_CHECK: ['team_leader']
    }
  },
  '/user/v1/cohort/search':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohort.read'],
      ROLE_CHECK: ['teacher','team_leader']
    }
  },
  '/user/v1/cohort/update/:cohortId':
  {
    method: ['put'],
    'put':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohort.update'],
      ROLE_CHECK: ['team_leader']
    }
  },
  '/user/v1/cohort/delete/:cohortId':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohort.delete'],
      ROLE_CHECK: ['team_leader']
    }
  },
  '/user/v1/cohort/mycohorts/:userId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohort.read'],
      ROLE_CHECK: ['teacher','team_leader']
    }
  },
  //cohort member
  '/user/v1/cohortmember/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohortmembers.create'],
      ROLE_CHECK: ['teacher']
    }
  },
  '/user/v1/cohortmember/read/:cohortId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohortmembers.read'],
      ROLE_CHECK: ['teacher','team_leader']
    }
  },
  '/user/v1/cohortmember/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohortmembers.read'],
      ROLE_CHECK: ['teacher','team_leader']
    }
  },
  '/user/v1/cohortmember/update/:cohortmembershipid':
  {
    method: ['put'],
    'put':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohortmembers.update'],
      ROLE_CHECK: ['teacher']
    }
  },
  '/user/v1/cohortmember/delete/:id':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['"cohortmembers.delete"'],
      ROLE_CHECK: ['teacher']
    }
  },
  '/user/v1/cohortmember/bulkcreate':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['cohortmembers.create'],
      ROLE_CHECK: ['teacher']
    }
  },
  //AssignTenant
  '/user/v1/assign-tenant':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  //rbac
  '/user/v1/rbac/roles/read/:id':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/roles/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/roles/update/:id':
  {
    method: ['put'],
    'put':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/roles/list/roles':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/roles/delete/:roleId':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/privileges':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/privileges/:privilegeId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/privileges/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/usersRoles':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/rbac/usersRoles/:userId':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/assignprivilege':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  '/user/v1/assignprivilege/:roleId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['ROLE_CHECK'],
      ROLE_CHECK: ['admin','team_leader']
    }
  },
  //auth - public
  '/user/v1/auth/login':
  {
    method: ['post'],
    'post':{
      checksNeeded: []
    }
  },
  //event-service
  //event
  '/event-service/event/v1/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/event-service/event/v1/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/event-service/event/v1/:id':
  {
    method: ['get','patch','delete'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    },
    'patch':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    },
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
    
  },
  //event-attendance
  '/event-service/attendees/v1/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/event-service/attendees/v1/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/event-service/attendees/v1':
  {
    method: ['post','delete'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    },
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },

  //notification-service
  //notification templates
  '/notification-templates':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/notification-templates/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/notification-templates/:id':
  {
    method: ['patch','delete'],
    'patch':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    },
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //notification-send
  '/notification/send':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/notification/sendTopicNotification':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //notification-queue
  '/queue':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/queue/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/queue/:id':
  {
    method: ['patch'],
    'patch':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/assessment/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/assessment/search':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/assessment/search/status':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/assessment/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/assessment/delete/:assessmentTrackingId':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  //tracking-content
  '/v1/tracking/content/read/:contentTrackingId':
  {
    method: ['get'],
    'get':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/content/create':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/content/search':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/content/search/status':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/content/list':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/v1/tracking/content/delete/:contentTrackingId':
  {
    method: ['delete'],
    'delete':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['users.create'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },

  //attendance service
  '/api/v1/attendance':
  {
    method: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK','DATA_TENANT','DATA_CONTEXT','DATA_TENANT_CONTEXT'],
      PRIVILEGE_CHECK: ['attendance.create','attendance.update','attendance.read'],
      ROLE_CHECK: ['teacher','admin','team_leader'],
      DATA_TENANT: [],
      DATA_CONTEXT: [],
      DATA_TENANT_CONTEXT: []
    }
  },
  '/api/v1/attendance/list':
  {
    methods: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
      PRIVILEGE_CHECK: ['attendance.read'],
      ROLE_CHECK: ['teacher','admin','team_leader']
    }
  },
  '/api/v1/attendance/bulkAttendance':
  {
    methods: ['post'],
    'post':{
      checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK','DATA_TENANT','DATA_CONTEXT','DATA_TENANT_CONTEXT'],
      PRIVILEGE_CHECK: ['attendance.create','attendance.update','attendance.read'],
      ROLE_CHECK: ['teacher','admin','team_leader'],
      DATA_TENANT: [],
      DATA_CONTEXT: [],
      DATA_TENANT_CONTEXT: []
    }
  }
};

export const urlPatterns = [
  //user-service
  //user
  '/user/v1/create',
  '/user/v1/read/:userId',
  '/user/v1/update/:userId',
  '/user/v1/delete/:userId',
  '/user/v1/password-reset-link',
  '/user/v1/forgot-password',
  '/user/v1/reset-password',
  //attendance
  '/user/v1/attendance',
  '/user/v1/attendance/list',
  '/user/v1/attendance/bulkAttendance',
  //cohort
  '/user/v1/cohort/cohortHierarchy/:cohortId',
  '/user/v1/cohort/create',
  '/user/v1/cohort/search',
  '/user/v1/cohort/update/:cohortId',
  '/user/v1/cohort/delete/:cohortId',
  '/user/v1/cohort/mycohorts/:userId',
  //cohort member
  '/user/v1/cohortmember/create',
  '/user/v1/cohortmember/read/:cohortId',
  '/user/v1/cohortmember/list',
  '/user/v1/cohortmember/update/:cohortmembershipid',
  '/user/v1/cohortmember/delete/:id',
  '/user/v1/cohortmember/bulkcreate',
  //AssignTenant
  '/user/v1/assign-tenant',
  //rbac
  '/user/v1/rbac/roles/read/:id',
  '/user/v1/rbac/roles/create',
  '/user/v1/rbac/roles/update/:id',
  '/user/v1/rbac/roles/list/roles',
  '/user/v1/rbac/roles/delete/:roleId',
  '/user/v1/rbac/privileges',
  '/user/v1/rbac/privileges/:privilegeId',
  '/user/v1/rbac/privileges/create',
  '/user/v1/rbac/usersRoles',
  '/user/v1/rbac/usersRoles/:userId',
  '/user/v1/assignprivilege',
  '/user/v1/assignprivilege/:roleId',
  //auth
  '/user/v1/auth/login',

  //event-service
  //event
  '/event-service/event/v1/create',
  '/event-service/event/v1/list',
  '/event-service/event/v1/:id',
  //event-attendance
  '/event-service/attendees/v1/create',
  '/event-service/attendees/v1/list',
  '/event-service/attendees/v1',

  //notification-service
  //notification templates
  '/notification-templates',
  '/notification-templates/list',
  '/notification-templates/:id',
  //notification-send
  '/notification/send',
  '/notification/sendTopicNotification',
  //notification-queue
  '/queue',
  '/queue/list',
  '/queue/:id',

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId',
  '/v1/tracking/assessment/create',
  '/v1/tracking/assessment/search',
  '/v1/tracking/assessment/search/status',
  '/v1/tracking/assessment/list',
  '/v1/tracking/assessment/delete/:assessmentTrackingId',
  //tracking-content
  '/v1/tracking/content/read/:contentTrackingId',
  '/v1/tracking/content/create',
  '/v1/tracking/content/search',
  '/v1/tracking/content/search/status',
  '/v1/tracking/content/list',
  '/v1/tracking/content/delete/:contentTrackingId',

  ///attendance-service
  '/api/v1/attendance/create',
  '/api/v1/attendance/list',
  '/api/v1/attendance/bulkAttendance',

]

//add public api
export const publicAPI = [
  '/user/v1/auth/login'
]

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);
