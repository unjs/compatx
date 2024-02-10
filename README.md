# Compatibility date flags (RFC)

🌴 Gradual feature flags.

> [!NOTE]
> This is the RFC for Compatibility Date Flags.
>
> See [API](./API.md) for a reference implementation.

## Background

JavaScript libraries often published to [npm registry](https://npmjs.com) use [semantic versioniong](https://semver.org/) for versioning their releases.

Semantic versioning allows indicating changes in 3 different types:

- Major changes (a breaking or behavior change added)
- Minor changes (a feature or noticable change happened)
- Patches and fixes (small fix or security patches)

Npm dependencies in projects and used by other libraries are specified with [semver ranges](https://www.npmjs.com/package/semver#ranges), a de facto standard to specify compatible ranges of a library a package manager can use, often/by-default specified with caret `^` ranges like `^3.1.4` that means, use any version of X `>=3.1.4` and `<=4.0.0`.

This system of versioning is what made enourmously big ecosystem of npm packages possible to work with each other and allows delivering package updates to the end-users without needing all the packages in the chain to update their dependencies in order to recieve a new feature or more importantly bug fixes.

## Motivation

While semver idea is proven to be practical both in theory and in practice, it also has shortcomings.

### No standard for change types

There is no clear defenition and rule that can say for a change to lead to next major, minor or patch release and the defenition changes case by case and package by package.

For example, there could be a bug-fix that at the same time also breaking a previously working behavior or a new feature that break another feature.

One simple solution is to bump those as explicit major changes to clearly indicate for end-users there are usage changes that need to be manually applied, which is always feasible considering chained dependency upgrade complexities.

### Dependency chain upgrade logicstics is costly with major bumps

As mentioned previously, there are significiant complexities involved for handling major version upgrades across ecosystem.
It is not uncommon that end-users use a package because it is a dependency of another dependency of another.

When a major change happens in the deeper dependencies, upgrade propagation gets slowed down signifituanly as all the in-between packages need to manually bump their version constrainst and usually themselves as their API is likely to be changed too, and this has to happen sequently bottom up in the dependency chain.

Another aspect of major version bumps is that library authors oftrn deliver latest fixes, secuirty patches and enhancenments to their latest major versions only and backporting (to the previous major versions) is not a common practice in JS ecosystem. It means that as a consequence of a major dependency bump, users have to upgrade their versions as soon as possible and in situation of nested dependency chains, it requires patience and collabration of every package in the chain to apply upgrade and be released.

With the complexities involved, major bumps are inevitable and when they happen in nested chains, there are intermediate dependencies that lag behind. As a result, it is likely to have multiple versions of the same library to be installed in user projects and while package managers try their best to deduplicate and automatically reduce number of installed versions using dependency hoisting, it makes insconsistency issues and likely causes issues with JS code bundlers which at best, means duplicate code in final bundles.

### Lock files are not a perfect solution

Semver cannot fully guarantee change safety. NPM package-managers use a lockfile - a snapshot of the resolved dependency graph and the exact versions with resolved from allowed semver ranges at last time lockfile had been created or updated.

Lock files guarantee what works in the locked state, works in other machinces idendically. It cannot guarantee if lockfile being recreated, something doesn't breaks (semver is not always strictly respected in the chain).

Also there is a matter of time. While the lockfile can freeze the exactly installed versions, runtime engines (such as Node.js version of production environment) change and get deprecated over the time. What used to work with a specific lockfile, can get broken when the runtime version upgrades or needs to be upgraded.

Package-managers also try to leverage lockfiles to improve stability with cost of delivering semver-compatible changes slower to the end-users. They do this because more changes in dependency graph, while can bring bug fixes and feature enhancenments can also risk the end-user's project to be broken and it is not always the best trade-off!

## Solution

This proposal introduces a new simple but efficient system between higher-level libraries (or meta-frameworks) and end-users on in parallel to semver versioning to give end-users a balanced stable AND updated experience.

While requirement of semver-major bumps in most of the lower-level npm packages is inevitable and is the standard go-to approach, higher-level libraries and meta-frameworks that internally use and wrap these libraries, are the API interface for end-users and can often ofter an stable exprience and help users to gradually opt-in into new features without breaking them and without slowing down the delivery.

The core of the idea is simple: feature flags with dates attached to them. Meta-frameworks, maintain a compatibility table of known feature flags and the date they are affective from and/or to.

When users start using a meta-framework, they lock their compatibility date (project initialize time) and frameworks know the latest features they can safely enable for new users, or disable for or do any desired action.

Users will gradually opt-in to the new features by upgrading their compatibility date to the desired one and even have fine-gained control during this upgrade for each feature flag.

## Compatibility Dates Spec

> [!NOTE]
> This section is for discussion only and not finalized.

### For end-users

When a project is initialized, the current date (in `YY-MM-DD` format) must be persisted in the relavant config file scoped to each project.

**Example:**

```ini
compatibility_date = 2023/03/14
```

In cases that persisting in configuration is not an option (ie: zero config setups), the framework might choose between latest compatibility features or safest defaults.

Other than compatibility dates, there are features that can be opted-in for the future compatibility. Those can be configured individually too:

```ini
compatibility_flags =  ["feature_a", "feature_b"]
```

## For integrations

When a framework adds integration to another framework or tool that supports compatibility dates, the main framework should lock the `compatibility_date` to a tested compatibility date of the sub-dependency.

Frameworks shall still allow end-users to also configure the conmpatibility for of those sub-dependencies to allow opting in faster without waiting on release cycle chain.

## Recommandations

End-users should prefer `compatibility_date` over `compatibility_flags` to have a more predictable behavior expected from framework.

Framework integrations should rely on compatibility based on `compatibility_date` rather than selective `compatibility_flags` of the sub-dependency. This helps to reduce the ecosystem fragmentation and reduce combination variations of individual flags.

End-users wanting to opt-in into a transitive feature of an integrated framework (sub-dependency) only, should prefer `compatibility_flags` over `compatibility_date` to reduce chance of experiment conflicts and keep their projects in the ideal state as much as possible.

It must be noted that even with possibility of compatibility flags framework authors should try to avoid breaking changes or using compatibility flags as an alternative to semver versioning for introducing breaking changes but only keep it as a tool that can help to progressively deliver enhanced behaviors with less chances of breaking changes.

## Naming Conventions

To allow better compatibility with different naming conventions, both kebab_case (`compatibility_date`, `compatibility_flags`) and camelCase (`compatibilityDate`, `compatibilityFlags`) shall be supported as aliases for user config.

## Implementsation

Implementation details of this proposal like where and how to store the persisted configuration per project or how to define and apply compatibility flags and dates is up to the framework authors.

This RFC is coupled with a reference implemention that can be used. See [API](./API.md) for more info.

## Final Notes

This proposal, does not solves every issue in the NPM ecosystem that mentioned in the RFC. The dependencies used always need to be in healthy state and regulary be upgraded with at least latest semver-major version of their sub dependencies.

For most of the libraries, maintainers have to stil be commited and more careful about introducing changes that are likely to break higher levels behavior. Low-level libraries should be designed to minimize the chance of API and behavior change possibilities and expose smaller utils that can be gradually replaced with new ones once an upgrade is required.

We at [unjs](https://unjs.io), are commited to make up to this standards when making low-level tools and packages to reduce number of breaking changes and fragmenetation in the ecosystem could be caused by major version upgrades.

The main goal of this proposal is to help the higher-level libraries and mainly meta-frameworks such as [Nitro](https://nitro.unjs.io) and [Nuxt](https://nuxt.com) that are directly used by end-users and can often provide a better experience by handling internal behavior themselves but also we encourage every Major meta-framework to consider adopting this or a approach.

This proposal is inspired by cloudflare's wrangler `compatibility_date` idea.
