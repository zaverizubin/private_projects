package nexusglobal.controlpanel.utils;

import com.vaadin.flow.component.html.Span;

public enum ApmFontAwesome {

    BULLSEYE_LIGHT(0xf140, "fal fa-bullseye", "/light/bullseye.svg"),
    CHART_BAR_LIGHT(0xf080, "fal fa-chart-bar", ""),
    CHART_PIE_LIGHT(0xf200, "fal fa-chart-pie", "/light/chart-pie.svg"),
    CHECK_LIGHT(0xf00c, "fal fa-check", "/light/check.svg"),
    CHECK_CIRCLE_DUO_TONE(0xf058, "fad fa-check-circle", ""),
    CHECK_CIRCLE_LIGHT(0xf058, "fal fa-check-circle", "/light/check-circle.svg"),
    COGS_LIGHT(0xf085, "fal fa-cogs", "/light/cogs.svg"),
    COMMENTS_LIGHT(0xf086, "fal fa-comments", ""),
    DOWNLOAD_LIGHT(0xf019, "fal fa-download", "/light/download.svg"),
    EXCLAMATION_TRIANGLE_LIGHT(0xf071, "fal fa-exclamation-triangle", "/light/exclamation-triangle.svg"),
    FILE_ALT_LIGHT(0xf15c, "fal fa-file-alt", "/light/file-alt.svg"),
    FILE_EDIT_LIGHT(0xf31c, "fal fa-file-edit", "/light/file-edit.svg"),
    FILTER_LIGHT(0xf0b0, "fal fa-filter", ""),
    INBOX_LIGHT(0xf01c, "fal fa-inbox", "/light/inbox.svg"),
    LIST_LIGHT(0xf03a, "fal fa-list", "/light/list.svg"),
    MICROSCOPE_LIGHT(0xf610, "fal fa-microscope", "/light/microscope.svg"),
    PASTE_LIGHT(0xf0ea, "fal fa-paste", ""),
    PENCIL_LIGHT(0xf040, "fal fa-pencil", "/light/pencil.svg"),
    PLAY_LIGHT(0xf04b, "fal fa-play", "/light/play.svg"),
    PRINT_LIGHT(0xf02f, "fal fa-print", ""),
    QUESTION_CIRCLE_LIGHT(0xf059, "fal fa-question-circle", ""),
    SENSOR_ALERT_LIGHT(0xf929, "fal fa-sensor-alert", "/light/sensor-alert.svg"),
    SIREN_ON_LIGHT(0xf92e, "fal fa-siren-on", "/light/siren-on.svg"),
    SITEMAP_LIGHT(0xf0e8, "fal fa-sitemap", "/light/sitemap.svg"),
    TACHOMETER_ALT_LIGHT(0xf3fd, "fal fa-tachometer-alt", "/light/tachometer-alt.svg"),
    TASKS_ALT_LIGHT(0xf828, "fal fa-tasks-alt", ""),
    THUMBS_UP_LIGHT(0xf164, "fal fa-thumbs-up", ""),
    TIMES_CIRCLE_LIGHT(0xf057, "fal fa-times-circle", "/light/tachometer-alt.svg"),
    TIMES_LIGHT(0xf00d, "fal fa-times", "/light/times.svg"),
    TOOLBOX_LIGHT(0xf552, "fal fa-toolbox", ""),
    TRASH_SOLID(0xf1f8, "fas fa-trash", "/solid/trash.svg"),
    UPLOAD_LIGHT(0xf093, "fal fa-upload", "/light/upload.svg"),
    USER_LIGHT(0xf007, "fal fa-user", ""),
    EYE(0xf06e, "fal fa-eye", "/light/eye.svg"),
    VIDEO_LIGHT(0xf03d, "fal fa-video", ""),
    WINDOW_CLOSE(0xf2d3, "fal fa-window-close", "/light/window-close.svg"),
    EXPAND_ARROWS_ALT(0xf31e, "far fa-expand-arrows-alt", ""),
    COMPRESS_ARROWS_ALT(0xf78c, "far fa-compress-arrows-alt", "");

    private final int codepoint;
    private final String cssClass;
    private final String svgPath;

    ApmFontAwesome(final int codepoint, final String cssClass, final String svgPath) {
        this.codepoint = codepoint;
        this.cssClass = cssClass;
        this.svgPath = svgPath;
    }

    public static ApmFontAwesome fromCodepoint(final int codepoint) {
        for (final ApmFontAwesome f : values()) {
            if (f.getCodepoint() == codepoint) {
                return f;
            }
        }
        throw new IllegalArgumentException("Codepoint " + codepoint + " not found in FontAwesome");
    }

    public String getSvgPath() {
        return "frontend/src/fontawesome/svgs" + this.svgPath;
    }

    public int getCodepoint() {
        return this.codepoint;
    }

    public String cssClass() {
        return this.cssClass;
    }

    public String getHtml() {
        return "<i class='" + this.cssClass + "'></i>";
    }

    public Span createImageSpan() {
        final Span span = new Span();
        span.setSizeFull();
        span.setClassName(cssClass());

        return span;
    }
}
