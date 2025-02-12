{
    "routes": [
        {
            "sourceRoute": "/interface/v1/api/question/v2/list",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/list",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/private/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/hierarchy/update",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/hierarchy/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/comment/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/channel/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }, 
        {
            "sourceRoute": "/interface/v1/action/asset/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }, 
        {
            "sourceRoute": "/interface/v1/action/content/v3/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/content/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }, 
        {
            "sourceRoute": "/interface/v1/action/questionset/private/v2/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }, 
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/review/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/review/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/reject/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/comment/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/composite/v3/search",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/object/category/definition/v1/read",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v1/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v1/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v1/upload/url/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v1/upload/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/upload/url/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/import",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/dialcode/link",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/upload/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/review/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/reject/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/hierarchy/add",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/hierarchy/update",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/hierarchy/remove",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v3/hierarchy/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/course/v1/hierarchy/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/license/v3/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/license/v3/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/license/v3/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/license/v3/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/asset/v3/validate",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/channel/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/channel/v1/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/channel/v1/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/list",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/master/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/master/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/master/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/category/master/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/term/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/term/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/term/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/framework/v1/term/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/v1/update",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/v1/read",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }, 
        {
            "sourceRoute": "/interface/v1/api/object/category/v1/retire",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/definition/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/definition/v1/update",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/definition/v1/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/object/category/definition/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/review/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/reject/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/system/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/question/v2/import",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/import",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/add",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/remove",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/questionset/v2/system/update/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/create",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/private/read/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/hierarchy/add",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/hierarchy/remove",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/hierarchy/update",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/hierarchy/:id",
            "type": "GET",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/flag/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/flag/accept/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/discard/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/retire/:id",
            "type": "DELETE",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/copy/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/system/update/:id",
            "type": "PATCH",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/reject/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/unlisted/publish/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/import/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/export/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/collection/v1/review/:id",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/api/content/v1/bundle",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        },
        {
            "sourceRoute": "/interface/v1/action/content/v1/bundle",
            "type": "POST",
            "priority": "MUST_HAVE",
            "inSequence": false,
            "orchestrated": false,
            "targetPackages": [
                {
                    "basePackageName": "cms",
                    "packageName": "shiksha-cms"
                }
            ]
        }
        
    ]
}