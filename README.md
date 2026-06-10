
poryect structure 

src
│
├── auth
│   ├── dto
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   │
│   ├── guards
│   │   ├── jwt.guard.ts
│   │   └── roles.guard.ts
│   │
│   ├── strategies
│   │   └── jwt.strategy.ts
│   │
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users
│   ├── dto
│   ├── schemas
│   │   └── user.schema.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── posts
│   ├── dto
│   ├── schemas
│   │   ├── post.schema.ts
│   │   └── comment.schema.ts
│   ├── posts.controller.ts
│   ├── comments.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
│
└── common
    ├── decorators
    ├── interceptors
    └── filters

npm run format