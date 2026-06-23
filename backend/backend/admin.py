from __future__ import annotations

from typing import Any

from django.contrib import admin
from django_celery_beat.models import CrontabSchedule


MERGED_ADMIN_GROUPS = (
    {
        "labels": {"account", "auth", "authtoken", "users"},
        "app_label": "identity",
        "name": "Пользователи и группы",
    },
    {
        "labels": {"content", "sites"},
        "app_label": "content_bundle",
        "name": "Контент",
    },
)


def _merge_admin_apps(app_list: list[dict[str, Any]]) -> list[dict[str, Any]]:
    remaining_apps = app_list[:]

    for group in MERGED_ADMIN_GROUPS:
        merged_models: list[dict[str, Any]] = []
        next_remaining_apps: list[dict[str, Any]] = []

        for app in remaining_apps:
            if app["app_label"] in group["labels"]:
                merged_models.extend(app["models"])
                continue

            next_remaining_apps.append(app)

        if merged_models:
            merged_models.sort(key=lambda model: model["name"])
            next_remaining_apps.append(
                {
                    "name": group["name"],
                    "app_label": group["app_label"],
                    "app_url": "",
                    "has_module_perms": True,
                    "models": merged_models,
                }
            )

        remaining_apps = next_remaining_apps

    remaining_apps.sort(key=lambda app: app["name"])
    return remaining_apps


def patch_admin_site() -> None:
    CrontabSchedule._meta.verbose_name = "Крон-расписание"
    CrontabSchedule._meta.verbose_name_plural = "Крон-расписания"

    original_get_app_list = admin.site.get_app_list

    def get_app_list(request, app_label: str | None = None) -> list[dict[str, Any]]:
        app_list = original_get_app_list(request, app_label)
        merged_labels = {label for group in MERGED_ADMIN_GROUPS for label in group["labels"]}
        if app_label and app_label not in merged_labels:
            return app_list

        return _merge_admin_apps(app_list)

    admin.site.get_app_list = get_app_list
