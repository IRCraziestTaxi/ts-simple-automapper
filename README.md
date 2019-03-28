# ts-simple-automapper
A simple AutoMapper implementation using property decorators.

## The issue
When relying on the keys of a destination object alone to map only desired properties from a source object, if the property has not been initialized, the key will not exist and will not be mapped to.

For example:

```ts
class User {
    public password: string;
    public username: string;
}

class UserDto {
    public username: string;
}

const user = new User();
user.password = "guest";
user.username = "johndoe";

const userDto = new UserDto();

for (const propKey in userDto) {
    userDto[propKey] = user[propKey];
}

// Results in undefined since the username property was never initialized on the userDto object.
console.log(userDto.username);
```

## Enter Mapper
The `Mapper` class processes existing keys on the destination object along with property mapping rules set up for source and destination objects via decorators.

```ts
import { Mapper } from "ts-simple-automapper";

const user: User;
const userDto: UserDto = new Mapper().map(user, new UserDto());

const users: User[];
const userDtos: UserDto[] = new Mapper().mapList(users, UserDto);
```

## Decorators
For mapping values TO a property on the destination object FROM the corresponding property on the source object (or a custom mapping function), use the following decorators:

* `@MapProp()`: Expose the property for mapping from a source object.
* `@Ignore()`: Skip mapping to this property for either all source object types or, optionally, one source object type.
* `@MapFrom()`: Map from the specified source type even if otherwise ignored; also use options for constructing a class type for the destination value and/or mapping from a custom property path.

```ts
class DestinationType {
    // Mapped even if not initialized prior to mapping.
    @MapProp()
    public mappedProp: string;

    // Ignored for all mappings.
    @Ignore()
    public ignoredForAllSourceTypes: string;

    // Ignored for only IgnoredSourceType.
    @Ignore(() => IgnoredSourceType)
    public ignoreForIgnoredSourceType: string;

    // Ignored for all source types except for AllowedSourceType.
    @Ignore()
    @MapFrom(() => AllowedSourceType)
    public ignoredForAllExceptOneSourceType: string;

    // Ignored for all source types except for AllowedSourceType
    // and for OtherAllowedSourceType.
    @Ignore()
    @MapFrom(() => AllowedSourceType)
    @MapFrom(() => OtherAllowedSourceType)
    public ignoredForAllExceptTwoSourceTypes: string;
}
```

More advanced examples of `MapFrom()`:

```ts
// Entities (source types)
class User {
    public profile: UserProfile;
}

class UserProfile {
    public firstName: string;
    public lastName: string;
    public status: UserStatus;
    public profile: UserProfile;
}

class UserStatus {
    public profile: UserProfile;
}

// DTOs (destination types)
class UserDto {
    // Map User.profile (a Profile object) as an instance of UserProfileDto.
    @MapFrom(() => User, { destinationValueTypeProvider: () => UserProfileDto })
    public profile: UserProfileDto;

    // Map UserDto.status from User.profile.status
    // and map it as an instance of UserStatusDto.
    @MapFrom(() => User, {
        destinationValueTypeProvider: () => UserStatusDto,
        mapFrom: u => u.profile.status
    })
    public status: UserStatusDto;
}

class UserProfileDto {
    // Map UserProfileDto.name as a concatenation of UserProfile.firstName
    // and UserProfile.lastName.
    @MapFrom(() => UserProfile, { mapFrom: up => `${up.firstName} ${up.lastName}` })
    public name: string;
}

class UserStatusDto {
}
```

To skip mapping a value FROM a property on the source object TO the corresponding property on the destination object, use the `@Hide()` decorator with an optional class type provider that hides the property only from the specified destination class type.

```ts
class SourceType {
    // Hidden from all destination types.
    @Hide()
    public hiddenFromAllDestinationTypes: string;

    // Hidden only from destination objects of type ForbiddenDestinationType.
    @Hide(() => ForbiddenDestinationType)
    public hiddenFromOneDestinationType: string;

    // Hidden only from destination objects of type ForbiddenDestinationType
    // or of type OtherForbiddenDestinationType.
    @Hide(() => ForbiddenDestinationType)
    @Hide(() => OtherForbiddenDestinationType)
    public hiddenFromTwoDestinationTypes: string;
}
```