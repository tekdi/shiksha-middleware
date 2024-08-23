
'use strict';

/**
 * @file - Sourcing Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-4.1.0
 * @version 1.0
 */
export const apiList = {
  '/user/v1/create':
  {
    checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher','admin','team_leader']
  },
  '/user/v1/read/:userId':
  {
    checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.read'],
    ROLE_CHECK: ['teacher','admin','team_leader']
  },
  '/user/v1/update':
  {
    checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.update'],
    ROLE_CHECK: ['teacher','admin','team_leader']
  },
  '/user/v1/delete':
  {
    checksNeeded: ['PRIVILEGE_CHECK','ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.delete'],
    ROLE_CHECK: ['teacher','admin','team_leader']
  }
};

export const urlPatterns = [
  '/user/v1/cohort/read/:cohortId',
  '/user/v1/read/:userId'
  ]

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);