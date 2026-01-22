export const CONFIG = {
  API: {
    GOALS_PATTERN: /\/api\/v1\/portfolios\/\d+\/goals\?/,
    PORTFOLIO_ID_REGEX: /portfolios\/(\d+)/,
    BASE_URL: "https://portfolio.drieam.app",
    FEEDBACK_ENDPOINT: (portfolioId: string, goalId: number) =>
      `https://portfolio.drieam.app/api/v1/portfolios/${portfolioId}/goals/${goalId}/feedback-items?page=1&per_page=100`,
  },

  TARGET_STATUSES: ["not_yet_started", "on_hold"],

  EVENTS: {
    FEEDBACK_COMPLETE: "portflow-ext-feedback-complete",
  },
}
