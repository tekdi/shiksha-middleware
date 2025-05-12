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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/private/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/hierarchy/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/comment/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/channel/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/asset/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/content/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/private/v2/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/reject/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/comment/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/asset/v1/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/asset/v1/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/asset/v1/upload/url/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/asset/v1/upload/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/upload/url/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/upload/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/reject/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/content/v3/hierarchy/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/course/v1/hierarchy/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/license/v3/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/license/v3/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/license/v3/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/channel/v1/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/channel/v1/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/master/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/master/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/category/master/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/term/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/term/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/framework/v1/term/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/api/object/category/definition/v1/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		
		{
			"sourceRoute": "/interface/v1/api/object/category/definition/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/reject/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/question/v2/system/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/questionset/v2/system/update/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/private/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/hierarchy/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/flag/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/flag/accept/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/discard/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/copy/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/system/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/reject/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/unlisted/publish/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/import/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/export/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/collection/v1/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
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
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/assessment/v3/items/create",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/assessment/v3/items/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/assessment/v3/items/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/assessment/v3/items/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/action/assessment/v3/items/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
			{
			"sourceRoute": "/learning-service/assessment/v3/items/create",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/learning-service/assessment/v3/items/read/:identifier",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/learning-service/assessment/v3/items/update/:identifier",
			"type": "PATCH",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/learning-service/assessment/v3/items/review/:identifier",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		},
		{
			"sourceRoute": "/learning-service/assessment/v3/items/retire/:identifier",
			"type": "DELETE",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "cms",
					"packageName": "shiksha-ecml-cms"
				}
			]
		}
	]
}