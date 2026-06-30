---
description: Guidelines for implementing server actions and data mutations. Follow this when creating or modifying server actions, handling form submissions, or managing data mutations in the application.
applyTo: ['**/actions.ts', '**/*.ts', '**/*.tsx']
---

# Server Actions and Data Mutations Guidelines

## Overview
All data mutations in this application must be implemented using server actions. This ensures centralized validation, authentication checks, and database operations while maintaining a clear separation of concerns.

## Architecture Requirements

### 1. Server Action File Organization
- Server action files **MUST** be named `actions.ts`
- Server action files **MUST** be colocated in the same directory as the component that calls them
- Example structure:
  ```
  components/
    LinkForm/
      LinkForm.tsx (client component that uses the action)
      actions.ts (server action file)
  ```

### 2. Calling Server Actions
- Server actions **MUST** be called only from client components
- Import server actions in client components using `'use server'` directive in the action file
- Example:
  ```typescript
  // components/LinkForm/LinkForm.tsx (client component)
  'use client';
  
  import { createLink } from './actions';
  
  export function LinkForm() {
    const handleSubmit = async (formData: LinkFormData) => {
      await createLink(formData);
    };
    
    return (/* JSX */);
  }
  ```

### 3. Type Safety for Server Actions

#### Data Parameters
- **MUST** define explicit TypeScript types for all data passed to server actions
- **MUST NOT** use the `FormData` TypeScript type as a parameter
- Use specific interfaces or types instead
- Example:
  ```typescript
  // ✅ CORRECT
  interface CreateLinkInput {
    originalUrl: string;
    customSlug?: string;
    expiresAt?: Date;
  }
  
  export async function createLink(input: CreateLinkInput) {
    // ...
  }
  
  // ❌ INCORRECT
  export async function createLink(formData: FormData) {
    // ...
  }
  ```

#### Return Types
- Define explicit return types for all server actions
- Example:
  ```typescript
  interface CreateLinkResult {
    success: boolean;
    shortUrl?: string;
    error?: string;
  }
  
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    // ...
  }
  ```

### 4. Input Validation with Zod
- **MUST** validate all input data using Zod in the server action
- Perform validation immediately after the authentication check
- Handle validation errors appropriately
- Example:
  ```typescript
  import { z } from 'zod';
  
  const createLinkSchema = z.object({
    originalUrl: z.string().url('Must be a valid URL'),
    customSlug: z.string().optional(),
    expiresAt: z.date().optional(),
  });
  
  export async function createLink(input: unknown): Promise<CreateLinkResult> {
    // 1. Check authentication (see next section)
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // 2. Validate input
    const validationResult = createLinkSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: 'Invalid input' };
    }
    
    const validatedInput = validationResult.data;
    
    // 3. Proceed with database operations
    // ...
  }
  ```

### 5. Authentication Check
- **MUST** check for a logged-in user at the start of every server action
- Perform this check **before** any database operations or side effects
- Return an appropriate error response if the user is not authenticated
- Example:
  ```typescript
  import { currentUser } from '@clerk/nextjs/server';
  
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    // ✅ FIRST: Check authentication
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // ✅ SECOND: Validate input
    const validatedInput = createLinkSchema.parse(input);
    
    // ✅ THIRD: Perform database operations
    return await createLinkHelper(user.id, validatedInput);
  }
  ```

### 6. Database Operations via Helper Functions
- **MUST** use helper functions from the `/data` directory for all database operations
- **MUST NOT** call Drizzle queries directly in server actions
- Helper functions wrap Drizzle queries and provide a clean interface
- Example helper function location: `/data/links.ts`
- Example usage:
  ```typescript
  // ✅ CORRECT: Use helper function
  import { createLinkHelper } from '@/data/links';
  
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const validatedInput = createLinkSchema.parse(input);
    
    // Use helper function
    const result = await createLinkHelper(user.id, validatedInput);
    
    return { success: true, shortUrl: result.shortUrl };
  }
  
  // ❌ INCORRECT: Direct Drizzle usage
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Do NOT do this
    const result = await db.insert(links).values({
      userId: user.id,
      originalUrl: input.originalUrl,
    });
    
    return { success: true };
  }
  ```

### 7. Error Handling
- **MUST NOT** throw errors in server actions
- **MUST** return an object with `success` and `error` properties instead
- All error conditions should be handled gracefully and returned to the client
- This allows client components to handle errors predictably without try-catch blocks
- Example:
  ```typescript
  // ✅ CORRECT: Return error in response object
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const validationResult = createLinkSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: 'Invalid input' };
    }
    
    try {
      const result = await createLinkHelper(user.id, validationResult.data);
      return { success: true, shortUrl: result.shortUrl };
    } catch (error) {
      // Catch errors and return in response object
      return { success: false, error: 'Failed to create link' };
    }
  }
  
  // ❌ INCORRECT: Throwing errors
  export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
    const user = await currentUser();
    if (!user) {
      throw new Error('Unauthorized'); // Do NOT throw
    }
    
    const result = await createLinkHelper(user.id, input);
    return { success: true, shortUrl: result.shortUrl };
  }
  ```

## Complete Example

```typescript
// components/LinkForm/actions.ts
'use server';

import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { createLinkHelper, updateLinkHelper } from '@/data/links';

const createLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL'),
  customSlug: z.string().min(1).optional(),
  expiresAt: z.date().optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

interface CreateLinkResult {
  success: boolean;
  shortUrl?: string;
  error?: string;
}

export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
  // 1. Check authentication
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Validate input
  const validationResult = createLinkSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message,
    };
  }

  const validatedInput = validationResult.data;

  // 3. Perform database operation via helper
  try {
    const result = await createLinkHelper(user.id, validatedInput);
    return { success: true, shortUrl: result.shortUrl };
  } catch (error) {
    return { success: false, error: 'Failed to create link' };
  }
}
```

```typescript
// components/LinkForm/LinkForm.tsx
'use client';

import { useState } from 'react';
import { createLink } from './actions';

interface LinkFormData {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date;
}

export function LinkForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: LinkFormData) => {
    const result = await createLink(formData);
    
    if (result.success) {
      // Handle success
      console.log('Short URL:', result.shortUrl);
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        originalUrl: e.currentTarget.originalUrl.value,
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## Checklist for Server Actions

- [ ] File named `actions.ts`
- [ ] Located in same directory as calling component
- [ ] Explicit TypeScript type for all inputs (NOT `FormData`)
- [ ] Explicit return type defined
- [ ] Zod schema for input validation
- [ ] Authentication check (`currentUser()`) performed first
- [ ] Validation performed after auth check
- [ ] All database operations via helper functions from `/data`
- [ ] No direct Drizzle queries in server actions
- [ ] Error handling: Returns error object instead of throwing
- [ ] All errors caught and returned in response object
- [ ] Clear error messages returned to client

## Related Standards

- See [data-fetching.instructions.md](./data-fetching.instructions.md) for data retrieval patterns
- See [auth.instructions.md](./auth.instructions.md) for authentication implementation details
