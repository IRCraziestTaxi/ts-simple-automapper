import "reflect-metadata";
import { Mapper } from "../../../src/mapper/Mapper";
import { UserAttributeDto } from "../../DTOs/UserAttributeDto";
import { UserDto } from "../../DTOs/UserDto";
import { UserDto_OptionalMappingRelationships } from "../../DTOs/UserDto_OptionalMappingRelationships";
import { UserProfileDto } from "../../DTOs/UserProfileDto";
import { UserStatusDto } from "../../DTOs/UserStatusDto";
import { User } from "../../entities/User";
import { UserAttribute } from "../../entities/UserAttribute";
import { UserProfile } from "../../entities/UserProfile";
import { UserStatus } from "../../entities/UserStatus";
import { User_OptionalMappingRelationships } from "../../entities/User_OptionalMappingRelationships";

function getUser(): User {
    const user = new User();
    user.hideThisPropFromAll = "I should be hidden from all";
    user.hideThisPropFromOne = "I should be hidden from one";
    user.ignoreThisPropFromAll = "I should be ignored by all";
    user.ignoreThisPropFromOne = "I should be ignored by one";
    user.notMapped = "I should not be mapped";
    user.password = "guest";
    user.username = "newuser";

    const profile = new UserProfile();
    profile.email = "newuser@example.com";
    profile.firstName = "John";
    profile.lastName = "Doe";
    profile.user = user;

    const status = new UserStatus();
    status.active = true;
    status.profile = profile;

    profile.status = status;

    user.profile = profile;

    const attribute1 = new UserAttribute();
    attribute1.attribute = "Attribute One";
    attribute1.user = user;

    const attribute2 = new UserAttribute();
    attribute2.attribute = "Attribute Two";
    attribute2.user = user;

    user.attributes = [attribute1, attribute2];

    return user;
}

function getUserWithOptionalMappingRelationships(): User_OptionalMappingRelationships {
    const userWithOptionalMappingRelationships = new User_OptionalMappingRelationships();
    userWithOptionalMappingRelationships.hideThisPropFromAll = "I should be hidden from all";
    userWithOptionalMappingRelationships.hideThisPropFromOne = "I should be hidden from one";
    userWithOptionalMappingRelationships.ignoreThisPropFromAll = "I should be ignored by all";
    userWithOptionalMappingRelationships.ignoreThisPropFromOne = "I should be ignored by one";
    userWithOptionalMappingRelationships.password = "guest";
    userWithOptionalMappingRelationships.username = "newuser";

    return userWithOptionalMappingRelationships;
}

describe("Mapper", () => {
    const mapper = new Mapper();

    const user = getUser();
    const userWithOptionalMappingRelationships = getUserWithOptionalMappingRelationships();

    it("ignores mappings from one source type", () => {
        const mappedWithoutProp = mapper.map(
            user,
            new UserDto_OptionalMappingRelationships()
        );
        const mappedWithProp = mapper.map(
            userWithOptionalMappingRelationships,
            new UserDto_OptionalMappingRelationships()
        );

        expect(mappedWithoutProp.ignoreThisPropFromOne)
            .toBeUndefined();
        expect(mappedWithProp.ignoreThisPropFromOne)
            .not
            .toBeUndefined();
    });

    it("ignores mappings from all source types", () => {
        const mappedWithoutProp = mapper.map(user, new UserDto());
        const alsoMappedWithoutProp = mapper.map(userWithOptionalMappingRelationships, new UserDto());

        expect(mappedWithoutProp.ignoreThisPropFromAll)
            .toBeUndefined();
        expect(alsoMappedWithoutProp.ignoreThisPropFromAll)
            .toBeUndefined();
    });

    it("ignores mappings from all sources types except specified type", () => {
        const mappedWithoutProp = mapper.map(
            user,
            new UserDto_OptionalMappingRelationships()
        );
        const mappedWithProp = mapper.map(
            userWithOptionalMappingRelationships,
            new UserDto_OptionalMappingRelationships()
        );

        expect(mappedWithoutProp.ignoreThisPropFromAll)
            .toBeUndefined();
        expect(mappedWithProp.ignoreThisPropFromAll)
            .not
            .toBeUndefined();
    });

    it("hides mappings from all destination types", () => {
        const mappedWithoutProp = mapper.map(user, new UserDto());
        const alsoMappedWithoutProp = mapper.map(user, new UserDto_OptionalMappingRelationships());

        expect(mappedWithoutProp.hideThisPropFromAll)
            .toBeUndefined();
        expect(alsoMappedWithoutProp.hideThisPropFromAll)
            .toBeUndefined();
    });

    it("hides mappings from one destination type", () => {
        const mappedWithProp = mapper.map(user, new UserDto());
        const mappedWithoutProp = mapper.map(user, new UserDto_OptionalMappingRelationships());

        expect(mappedWithProp.hideThisPropFromOne)
            .not
            .toBeUndefined();
        expect(mappedWithoutProp.hideThisPropFromOne)
            .toBeUndefined();
    });

    it("does not map when not using @MapProp decorator", () => {
        const mappedWithoutProp = mapper.map(user, new UserDto());

        expect(mappedWithoutProp.notMapped)
            .toBeUndefined();
    });

    it("maps when using @MapProp decorator", () => {
        const mappedWithProp = mapper.map(user, new UserDto());

        expect(mappedWithProp.username)
            .not
            .toBeUndefined();
    });

    it("calculates correct value when using MapFromOptions.mapFrom", () => {
        const mapped = mapper.map(user, new UserDto());

        expect(mapped.profile.name)
            .toBe(`${user.profile.firstName} ${user.profile.lastName}`);
    });

    it("constructs correct type for destination", () => {
        const mapped = mapper.map(user, new UserDto());

        expect(mapped.profile instanceof UserProfileDto)
            .toBe(true);
    });

    it("constructs correct type for destination with correct mapping path", () => {
        const mapped = mapper.map(user, new UserDto());

        expect(mapped.status instanceof UserStatusDto)
            .toBe(true);
    });

    it("maps collections with correct types for destinations", () => {
        const collection = [getUser(), getUser(), getUser()];

        const mappedCollection = mapper.mapList(collection, UserDto);

        const badMapping = mappedCollection.find(m => (
            !(m instanceof UserDto)
            || !(m.profile instanceof UserProfileDto)
            || !(m.status instanceof UserStatusDto)
        ));

        expect(badMapping)
            .toBeUndefined();
    });

    it("maps collections for specified destination types", () => {
        const mapped = mapper.map(user, new UserDto());

        expect(mapped.attributes instanceof Array)
            .toBe(true);

        const badMapping = mapped.attributes.find(a => !(a instanceof UserAttributeDto));

        expect(badMapping)
            .toBeUndefined();
    });

    it("ignores functions", () => {
        const mapped = mapper.map(user, new UserDto());

        expect(mapped.getterTest)
            .not
            .toBe(user.getterTest);
        expect(mapped.functionTest())
            .not
            .toBe(user.functionTest());
    });
});
