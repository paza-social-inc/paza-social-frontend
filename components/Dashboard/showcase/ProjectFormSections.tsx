"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, Plus, X } from "lucide-react";

/** Shared shape for create + edit project forms (title + description + discovery). */
export type ProjectFormBaseData = {
  title: string;
  description?: string;
  category?: string;
  location?: string;
};

export type ProjectFormSectionsProps = {
  register: UseFormRegister<ProjectFormBaseData>;
  errors: FieldErrors<ProjectFormBaseData>;
  mediaUrls: string[];
  setMediaUrls: Dispatch<SetStateAction<string[]>>;
  mediaInputValue: string;
  setMediaInputValue: (v: string) => void;
  mediaUrlError: string | null;
  setMediaUrlError: (v: string | null) => void;
  addMediaUrl: () => void;
  goals: string[];
  setGoals: Dispatch<SetStateAction<string[]>>;
  goalInput: string;
  setGoalInput: (v: string) => void;
  addGoal: () => void;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: (v: string) => void;
  addTag: () => void;
  /** Copy for the collaborators card (create vs edit wording). */
  collaboratorsHint?: string;
};

export function ProjectFormSections({
  register,
  errors,
  mediaUrls,
  setMediaUrls,
  mediaInputValue,
  setMediaInputValue,
  mediaUrlError,
  setMediaUrlError,
  addMediaUrl,
  goals,
  setGoals,
  goalInput,
  setGoalInput,
  addGoal,
  tags,
  setTags,
  tagInput,
  setTagInput,
  addTag,
  collaboratorsHint = "You can invite collaborators after creating the project from the project dashboard.",
}: ProjectFormSectionsProps) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Project details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Project title</FieldLabel>
            <Input
              {...register("title")}
              placeholder="e.g. Summer campaign collab"
              className="min-h-12 touch-manipulation text-base"
              autoComplete="off"
              aria-invalid={!!errors.title}
            />
            <FieldError errors={errors.title ? [errors.title] : []} />
          </Field>
          <Field>
            <FieldLabel>Project description</FieldLabel>
            <Textarea
              {...register("description")}
              placeholder="Describe the project, goals, and context..."
              className="min-h-24 resize-y text-base"
              aria-invalid={!!errors.description}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Showcase discovery</CardTitle>
          <FieldDescription>
            Add a category, location, and tags so brands can find your project in the showcase
            filters.
          </FieldDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Input
              {...register("category")}
              placeholder="e.g. Fashion, Tech, Lifestyle"
              className="min-h-12 text-base"
              autoComplete="off"
              aria-invalid={!!errors.category}
            />
            <FieldError errors={errors.category ? [errors.category] : []} />
          </Field>
          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input
              {...register("location")}
              placeholder="e.g. Nairobi, Kenya"
              className="min-h-12 text-base"
              autoComplete="off"
              aria-invalid={!!errors.location}
            />
            <FieldError errors={errors.location ? [errors.location] : []} />
          </Field>
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <FieldDescription className="mb-2">
              Short keywords (press Enter or Add). Used for showcase search and filters.
            </FieldDescription>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. UGC, campaign"
                className="min-h-12 flex-1 text-base"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                className="min-h-12 touch-manipulation"
                onClick={addTag}
              >
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
            {tags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <li key={`${t}-${i}`}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setTags((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                        aria-label={`Remove tag ${t}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Upload media</CardTitle>
          <FieldDescription>
            Add photos, videos, audio, or links (paste URLs for now).
          </FieldDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={mediaInputValue}
              onChange={(e) => {
                setMediaInputValue(e.target.value);
                if (mediaUrlError) setMediaUrlError(null);
              }}
              placeholder="Paste image or video URL (https://...)"
              className="min-h-12 flex-1 text-base"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addMediaUrl())
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="min-h-12 min-w-12 shrink-0 touch-manipulation"
              aria-label="Add media"
              onClick={addMediaUrl}
            >
              <LinkIcon className="h-5 w-5" />
            </Button>
          </div>
          {mediaUrlError && (
            <p className="text-sm text-destructive" role="alert">
              {mediaUrlError}
            </p>
          )}
          {mediaUrls.length > 0 && (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {mediaUrls.map((url, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() =>
                      setMediaUrls((prev) => prev.filter((_, j) => j !== i))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Tag collaborators or brands
            </CardTitle>
            <FieldDescription>
              Optional. Add collaborator names or brand handles later from the project
              page.
            </FieldDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{collaboratorsHint}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Set goals</CardTitle>
            <FieldDescription>
              Goals for this project (e.g. reach, engagement).
            </FieldDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. 100k reach"
                className="min-h-12 flex-1 text-base"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGoal())
                }
              />
              <Button
                type="button"
                variant="outline"
                className="min-h-12 touch-manipulation"
                onClick={addGoal}
              >
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
            {goals.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {goals.map((g, i) => (
                  <li key={i}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      {g}
                      <button
                        type="button"
                        onClick={() =>
                          setGoals((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                        aria-label={`Remove ${g}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
