import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PersonalInfoStepProps } from "@/types/preferences/Creator/CreatorType";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { cn } from "@/lib/utils";
import { Country, State } from "country-state-city";

export default function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
    const countries = useMemo(() => Country.getAllCountries(), []);

    const selectedCountry = useMemo(
        () => countries.find((c) => c.name === data.country),
        [countries, data.country]
    );

    const states = useMemo(
        () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
        [selectedCountry]
    );

    const handleCountryChange = (isoCode: string) => {
        const country = countries.find((c) => c.isoCode === isoCode);
        onUpdate({ country: country?.name ?? "", stateRegion: "" });
    };

    const handleStateChange = (isoCode: string) => {
        const state = states.find((s) => s.isoCode === isoCode);
        onUpdate({ stateRegion: state?.name ?? "" });
    };

    return (
        <StepSection kicker="Personal info" title="Tell us about you">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className={cj.labelField}>
                        First name
                    </Label>
                    <Input
                        id="firstName"
                        autoComplete="given-name"
                        value={data.firstName}
                        onChange={(e) => onUpdate({ firstName: e.target.value })}
                        className={cn(cj.input, "h-11")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName" className={cj.labelField}>
                        Last name
                    </Label>
                    <Input
                        id="lastName"
                        autoComplete="family-name"
                        value={data.lastName}
                        onChange={(e) => onUpdate({ lastName: e.target.value })}
                        className={cn(cj.input, "h-11")}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="gender" className={cj.labelField}>
                            Gender
                        </Label>
                        <Select
                            value={data.gender || undefined}
                            onValueChange={(value) => onUpdate({ gender: value })}
                        >
                            <SelectTrigger id="gender" className={cn(cj.input, "h-11")}>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non_binary">Non-binary</SelectItem>
                                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className={cj.labelField}>
                            Date of birth
                        </Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={data.dateOfBirth}
                            onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
                            className={cn(cj.input, "h-11")}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country" className={cj.labelField}>
                        Country
                    </Label>
                    <Select
                        value={selectedCountry?.isoCode ?? undefined}
                        onValueChange={handleCountryChange}
                    >
                        <SelectTrigger id="country" className={cn(cj.input, "h-11")}>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            {countries.map((c) => (
                                <SelectItem key={c.isoCode} value={c.isoCode}>
                                    {c.flag} {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stateRegion" className={cj.labelField}>
                        State / region
                    </Label>
                    {selectedCountry && states.length > 0 ? (
                        <Select
                            value={
                                states.find((s) => s.name === data.stateRegion)?.isoCode ?? undefined
                            }
                            onValueChange={handleStateChange}
                        >
                            <SelectTrigger id="stateRegion" className={cn(cj.input, "h-11")}>
                                <SelectValue placeholder="Select state / region" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {states.map((s) => (
                                    <SelectItem key={s.isoCode} value={s.isoCode}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            id="stateRegion"
                            autoComplete="address-level1"
                            placeholder={
                                selectedCountry ? "State or region" : "Select a country first"
                            }
                            value={data.stateRegion}
                            disabled={!selectedCountry}
                            onChange={(e) => onUpdate({ stateRegion: e.target.value })}
                            className={cn(cj.input, "h-11")}
                        />
                    )}
                </div>
            </div>
        </StepSection>
    );
}