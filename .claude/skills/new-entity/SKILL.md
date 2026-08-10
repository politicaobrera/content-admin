---
name: new-entity
description: Scaffold a new content entity end-to-end in this repo (server actions, hook, list/new/edit pages, table + form components, type) following the existing app/tags vertical-slice pattern. Use when the user asks to add a new content type/entity/CRUD section to the admin panel (e.g. "add a Categories entity", "scaffold a new entity called X").
---

# new-entity

Scaffolds a full vertical slice for a new content entity in this Next.js admin panel, mirroring the pattern used by `app/tags/` (the cleanest reference implementation with full CRUD) rather than `app/authors/` (no delete) or `app/sections/` (uses the less-common `GenericForm` abstraction).

## Before generating anything

Ask the user (if not already given) for:
1. **Entity name**, singular PascalCase (e.g. `Category`) — used for types/components — and confirm the plural/lowercase route slug (e.g. `categories`).
2. **Fields**: name + type for each (e.g. `name: string`, `order: number`). Keep it to flat scalar fields for the base template — mention that repeatable fields (`useFieldArray`, like `authors.descriptions`) or nested `field_subfield` groups (like `sections.style_color`) are extensions to add manually afterward, not part of this scaffold.
3. Whether the backend endpoint already exists at `${CONTENT_SERVER_URL}/<plural-slug>` (assume REST conventions: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`) — if the user doesn't know, proceed with that assumption and flag it.

Do not ask about image uploads, SEO fields, or scheduling — those are separate, entity-specific concerns layered on top of this base CRUD slice, not part of it.

## Files to create

For an entity `Tag`/`tags` (replace with the real name), create exactly these files:

```
app/types/<entity>.ts
app/actions/data/<entities>/get<Entities>.ts
app/actions/data/<entities>/get<Entity>.ts
app/actions/data/<entities>/create<Entity>.ts
app/actions/data/<entities>/edit<Entity>.ts
app/actions/data/<entities>/delete<Entity>.ts
app/<entities>/hooks/use<Entity>.ts
app/<entities>/page.tsx
app/<entities>/new/page.tsx
app/<entities>/[id]/page.tsx
app/<entities>/components/<Entities>.tsx
app/<entities>/components/<Entity>Table.tsx
app/<entities>/components/<Entity>Form.tsx
```

Naming rules (match the existing codebase exactly — do not deviate):
- Files/dirs under `app/actions/data/` and the entity route dir are **plural, lowercase** (`tags`, `categories`).
- Component files are **PascalCase singular/plural** matching their role (`TagForm.tsx`, `TagTable.tsx`, `Tags.tsx`).
- Action function names: `get<Entities>` (list), `get<Entity>` (one), `create<Entity>`, `edit<Entity>` (not `update`), `delete<Entity>` (not `remove`).
- Every file's primary artifact is a `const` declared then `export default`ed at the bottom — no `export default function`, no other named exports (except the type file, which uses `export type`).
- All user-facing strings (errors, toasts) are in **Spanish**, following the exact templates below.
- `console.log` calls in the reference implementation are incidental debug noise — do NOT copy them into the generated code.

## Deviations from the reference implementation — fix these, don't copy them

The `tags` slice (the best current example) has two known bugs. The generated code must NOT reproduce them:
1. `getTags.ts`/`editTag.ts` are missing the try/catch wrapper that `getTag`/`createTag`/`deleteTag` have — **always generate the try/catch version** (shown below).
2. `TagForm.tsx`'s submit handler calls `edit(...)` when a record is passed AND unconditionally also calls `create(...)` — this double-fires on every edit. **Always generate an `if (entity) { edit(...) } else { create(...) }` branch.**

## Templates

### `app/types/<entity>.ts`
```ts
export type <Entity>Type = {
  _id: string
  <field1>: <type1>
  <field2>: <type2>
  lastModifiedBy: string
  createdAt: string
}
```

### `app/actions/data/<entities>/get<Entities>.ts` (list)
```ts
'use server'

import { <Entity>Type } from "@/app/types/<entity>"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const <entity>sApi = process.env.CONTENT_SERVER_URL + '/<entities>'

const get<Entities> = async function (searchParams: Params): Promise<iResponseMany<<Entity>Type>> {
  try {
    const query = buildQueryString(searchParams)
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${<entity>sApi}?${query}`, { headers, cache: 'no-store' })

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener los <entities> (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return res
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default get<Entities>
```

### `app/actions/data/<entities>/get<Entity>.ts` (one)
```ts
'use server'

import { <Entity>Type } from "@/app/types/<entity>"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const <entity>Api = process.env.CONTENT_SERVER_URL + '/<entities>'

const get<Entity> = async function (id: string): Promise<iResponseOne<<Entity>Type>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${<entity>Api}/${id}`, {
      headers: { ...headers, 'Accept': 'application/json' },
      cache: 'no-store',
    })
    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el <entity> (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default get<Entity>
```

### `app/actions/data/<entities>/create<Entity>.ts`
```ts
'use server'

import { <Entity>Type } from "@/app/types/<entity>"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const <entity>sApi = process.env.CONTENT_SERVER_URL + '/<entities>'

const create<Entity> = async function (data: Partial<<Entity>Type>): Promise<iResponseOne<<Entity>Type>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${<entity>sApi}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear el <entity> (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default create<Entity>
```

### `app/actions/data/<entities>/edit<Entity>.ts`
```ts
'use server'

import { <Entity>Type } from "@/app/types/<entity>"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const <entity>sApi = process.env.CONTENT_SERVER_URL + '/<entities>'

const edit<Entity> = async function (data: Partial<<Entity>Type>): Promise<iResponseOne<<Entity>Type>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${<entity>sApi}/${data._id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al editar el <entity> ${data._id} (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default edit<Entity>
```

### `app/actions/data/<entities>/delete<Entity>.ts`
```ts
'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const <entity>sApi = process.env.CONTENT_SERVER_URL + '/<entities>'

const delete<Entity> = async function (id: string): Promise<iResponseOne<null>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${<entity>sApi}/${id}`, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    })
    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar el <entity> ${id} (${response.status}): ${response.statusText}`,
        },
      }
    }
    return { data: null }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default delete<Entity>
```

### `app/<entities>/hooks/use<Entity>.ts`
```ts
import { <Entity>Type } from "@/app/types/<entity>";
import edit<Entity> from "@/app/actions/data/<entities>/edit<Entity>";
import create<Entity> from "@/app/actions/data/<entities>/create<Entity>";
import get<Entities> from "@/app/actions/data/<entities>/get<Entities>";
import delete<Entity> from "@/app/actions/data/<entities>/delete<Entity>";

export default function use<Entity>() {
  const edit = async (<entity>: Partial<<Entity>Type>) => {
    const { data, error } = await edit<Entity>(<entity>);
    return { data, error };
  }

  const create = async (<entity>: Partial<<Entity>Type>) => {
    const { data, error } = await create<Entity>(<entity>);
    return { data, error };
  }

  const search = async (searchParams: Record<string, string>) => {
    const { data, error } = await get<Entities>(searchParams);
    return { data, error };
  }

  const remove = async (id: string) => {
    const { data, error } = await delete<Entity>(id);
    return { data, error };
  }

  return { edit, create, search, remove }
}
```

### `app/<entities>/page.tsx` (list)
```tsx
import { Suspense } from "react"
import MainContainer from "@/app/components/layout/MainContainer"
import <Entities> from "./components/<Entities>"
import Loading from "@/app/components/Loading"
import { Params } from "@/app/types/requests"

const <Entities>Page = async ({
  searchParams,
}: {
  searchParams: Promise<Params>,
}) => {
  const params = await searchParams
  return (
    <MainContainer>
      <section id="<entities>-page" className="flex flex-col gap-3 px-4">
        <h1 className="mt-6 text-center text-2xl text-black tracking-tight font-bold">
          <Entities>
        </h1>
        <Suspense fallback={<Loading />}>
          <<Entities> searchParams={params} />
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default <Entities>Page
```

### `app/<entities>/components/<Entities>.tsx` (server component: fetch + render table)
```tsx
import get<Entities> from "@/app/actions/data/<entities>/get<Entities>"
import { iResponseMany } from "@/app/types/responses"
import { <Entity>Type } from "@/app/types/<entity>"
import ErrorMessage from "@/app/components/ErrorMessage"
import <Entity>Table from "./<Entity>Table"
import { Params } from "@/app/types/requests"

interface <Entities>Props {
  searchParams: Params;
}

const <Entities>: React.FC<<Entities>Props> = async ({ searchParams }) => {
  const { data, error, meta }: iResponseMany<<Entity>Type> = await get<Entities>(searchParams)
  if (error) {
    return <ErrorMessage error={error} />
  }
  if (!data) {
    return (<div>No hay data</div>)
  }
  return (
    <div className="h-screen">
      <<Entity>Table <entities>={data} meta={meta} />
    </div>
  )
}

export default <Entities>
```

### `app/<entities>/new/page.tsx`
```tsx
import MainContainer from "@/app/components/layout/MainContainer"
import <Entity>Form from "../components/<Entity>Form"

const New<Entity>Page = async () => {
  return (
    <MainContainer>
      <<Entity>Form />
    </MainContainer>
  )
}

export default New<Entity>Page
```

### `app/<entities>/[id]/page.tsx`
```tsx
import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import get<Entity> from "@/app/actions/data/<entities>/get<Entity>"
import ErrorMessage from "@/app/components/ErrorMessage"
import <Entity>Form from "../components/<Entity>Form"
import { <Entity>Type } from "@/app/types/<entity>"

const <Entity>Page = async ({
  params,
}: {
  params: Promise<{ id: string }>,
}) => {
  const { id } = await params
  const { data, error }: iResponseOne<<Entity>Type> = await get<Entity>(id)

  if (error) {
    return <ErrorMessage error={error} />
  }
  if (!data) {
    return <div>No hay <Entity></div>
  }
  return (
    <MainContainer>
      <<Entity>Form <entity>={data} />
    </MainContainer>
  )
}

export default <Entity>Page
```

### `app/<entities>/components/<Entity>Form.tsx`
One `<Input>` per field. Repeat the `<Input>` block for each field the user specified, adjusting `id`/`label`/`type`/`defaultValues` key accordingly.
```tsx
'use client'

import React, { useState } from "react"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { useRouter } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import Separator from "@/app/components/layout/Separator"
import { <Entity>Type } from "@/app/types/<entity>"
import use<Entity> from "../hooks/use<Entity>"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"

interface <Entity>FormProps {
  <entity>?: <Entity>Type
}

const <Entity>Form: React.FC<<Entity>FormProps> = ({ <entity> }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { edit, create } = use<Entity>();

  const {
    register, handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      <field1>: <entity>?.<field1> || "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (payload) => {
    setLoading(true)
    const action = <entity>
      ? edit(Object.assign({}, <entity>, payload))
      : create(payload as Partial<<Entity>Type>)

    action.then(result => {
      if (result.error) { toast.error(result.error.message) }
      if (result.data) {
        toast.success(<entity> ? "<Entity> editado correctamente" : "<Entity> creado correctamente")
        router.refresh()
        if (!<entity>) router.push('/<entities>')
      }
    }).finally(() => setLoading(false))
  }

  const handleCancel = () => { router.push(`/<entities>`) }

  return (
    <div className="mt-8 mx-4">
      <div className="bg-white px-4 py-8 rounded-lg shadow">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input label="<Field1 label>" id="<field1>" type="text" register={register}
            required={true} disabled={loading} errors={errors} placeHolder="<Field1 label>" />
          <Separator />
          <ActionButtonsContainer>
            <Button type="submit" disabled={loading}>{loading ? 'Loading' : 'Guardar'}</Button>
            <Button danger disabled={loading} onClick={handleCancel}>{loading ? 'Loading' : 'Cancelar'}</Button>
          </ActionButtonsContainer>
        </form>
      </div>
    </div>
  )
}

export default <Entity>Form
```

### `app/<entities>/components/<Entity>Table.tsx`
Base this directly on `app/tags/components/TagTable.tsx` (read that file for the full filter/sort/pagination-via-URL implementation and copy its structure) — replace `Tag`/`tag`/`tags` with the new entity's names, and generate one `<th>`/`<td>` pair per field the user specified instead of tags' single `name` column. Keep:
- Props `{ <entities>: <Entity>Type[]; meta: PaginationMeta | undefined }`
- `filters`/`sort`/`pagination` state seeded from `useSearchParams()`, round-tripped via `router.push` on change
- `handleClickEdit` → `/<entities>/${id}`, `handleClickNew` → `/<entities>/new`
- `handleClickDelete` → confirm, call `remove` from `use<Entity>`, then `toast` + `router.refresh()`

## After generating

1. Tell the user which files were created and remind them:
   - Add a sidebar/nav link if this entity should be reachable from the UI (check `app/components/layout/Sidebar` or equivalent).
   - If the route needs auth gating like `/main`, `/sections`, `/articles`, add the new route prefix to `middleware.ts`.
   - Run `npm run lint` and `npm run build` (or at least `tsc --noEmit`) to catch type errors from the placeholder field types.
2. Do not invent extra fields, image upload, or SEO logic unless asked — keep the scaffold minimal and let the user extend it.
