import React, { useState } from "react";
import { createPortal } from "react-dom";
import ReactCountryFlag from "react-country-flag";
import { getConflictSeverityColor, getConflictSeverityLabel, formatCompactNumber } from "./formattingUtils";
import './OngoingConflicts.css'

// Flag cluster per conflict card is capped at 4 - conflicts like the
// Arab-Israeli/Iran-Israel one have 15 belligerents, and showing them all
// would dominate the card. The rest are summarized as "+N".
const MAX_FLAGS = 4;

/**
 * "Ongoing Conflicts" section for the import sidebar. Renders nothing at
 * all if `conflicts` is empty/undefined - the selected country isn't a
 * belligerent in any conflict tracked by GET /conflicts/by_country, so the
 * section shouldn't take up any space.
 *
 * @param {Array} conflicts Conflicts the selected country is a belligerent
 *   in, as returned by fetchConflictsByCountry: [{conflict_id, name,
 *   start_year, total_deaths_est, military_deaths_est, civilian_deaths_est,
 *   refugees_est, idps_est, confidence, wikipedia_url,
 *   belligerents: [{country_name, alpha2}]}]
 */
const OngoingConflicts = ({ conflicts }) => {
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

    if (!conflicts || conflicts.length === 0) {
        return null;
    }

    return (
        <div className="ongoing-conflicts">
            <div className="barPlot-title">Ongoing Conflicts</div>

            <div className="disclaimer-banner">
                <span className="icon" aria-hidden="true">⚠️</span>
                <span className="copy">
                    <b>This section contains rough, contested estimates— not verified data.</b>
                    <button type="button" className="link" onClick={() => setIsDisclaimerOpen(true)}>
                        Read the full disclaimer here.
                    </button>
                </span>
            </div>

            {conflicts.map((conflict) => {
                const severityColor = getConflictSeverityColor(conflict.total_deaths_est);
                const severityLabel = getConflictSeverityLabel(conflict.total_deaths_est);
                const shownFlags = conflict.belligerents.filter((b) => b.alpha2).slice(0, MAX_FLAGS);
                const moreCount = conflict.belligerents.length - shownFlags.length;
                const militaryShare = (conflict.military_deaths_est / conflict.total_deaths_est) * 100;
                const civilianShare = (conflict.civilian_deaths_est / conflict.total_deaths_est) * 100;

                return (
                    <details className="conflict-card" key={conflict.conflict_id} style={{ '--row-color': severityColor }}>
                        <summary>
                            <div>
                                <div className="row-flags">
                                    {shownFlags.map((b) => (
                                        <ReactCountryFlag
                                            key={b.alpha2}
                                            countryCode={b.alpha2}
                                            svg
                                            style={{ width: '1em', height: '1em', marginRight: '2px' }}
                                            title={b.country_name}
                                        />
                                    ))}
                                    {moreCount > 0 && <span className="more">+{moreCount}</span>}
                                </div>
                                <p className="row-name">{conflict.name}</p>
                                <p className="row-meta">
                                    Since {conflict.start_year} · <span className="sev-label">{severityLabel}</span> · ~{formatCompactNumber(conflict.total_deaths_est)} killed
                                </p>
                            </div>
                            <svg className="chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </summary>
                        <div className="card-detail">
                            <div className="split-bar">
                                <div className="mil" style={{ width: `${militaryShare}%` }} />
                                <div className="civ" style={{ width: `${civilianShare}%` }} />
                            </div>
                            <div className="split-legend">
                                <span><i style={{ background: 'var(--deck-accent-strong)' }} />Military {formatCompactNumber(conflict.military_deaths_est)}</span>
                                <span><i style={{ background: severityColor }} />Civilian {formatCompactNumber(conflict.civilian_deaths_est)}</span>
                            </div>
                            <div className="detail-stats">
                                <div className="detail-stat">
                                    <div className="lbl">Refugees</div>
                                    <div className="val">{formatCompactNumber(conflict.refugees_est)}</div>
                                </div>
                                <div className="detail-stat">
                                    <div className="lbl">IDPs</div>
                                    <div className="val">{formatCompactNumber(conflict.idps_est)}</div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="confidence-tag">{conflict.confidence} confidence</span>
                                <a className="source-link" href={conflict.wikipedia_url} target="_blank" rel="noopener noreferrer">
                                    Wikipedia ↗
                                </a>
                            </div>
                        </div>
                    </details>
                );
            })}

            {/* Portaled straight to <body> rather than rendered in place: .panel's
                backdrop-filter makes it the containing block for any
                position: fixed descendant (per spec, same as transform/filter),
                and .scrollable-content's mask-image (see SideBar.css) gives it
                its own stacking context - between the two, an in-place fixed
                overlay was rendering clipped/behind the sidebar's own fixed
                header instead of over the whole page. Escaping the DOM tree
                entirely sidesteps both. */}
            {isDisclaimerOpen && createPortal(
                <div className="disclaimer-overlay" onClick={() => setIsDisclaimerOpen(false)}>
                    <div
                        className="disclaimer-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="conflict-disclaimer-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="dialog-header">
                            <div>
                                <h2 id="conflict-disclaimer-title">About the conflict data</h2>
                                <p className="dialog-sub">Applies to every conflict shown in this sidebar, not just the ones below.</p>
                            </div>
                            <button type="button" className="dialog-close-btn" aria-label="Close" onClick={() => setIsDisclaimerOpen(false)}>✕</button>
                        </div>
                        <div className="dialog-body">
                            <h3>What this is</h3>
                            <p>Conflicts are complex, complicated and reporting on them is rife with bias, misinformation, controversy and straight up propaganda. The belligerents in any conflict change, countries, groups and coalitions form, disband and re-form, join and abandon the conflict at various times. Sub-conflicts, proxy-wars and spill-overs are not uncommon. Conflicts can remain dormant for years or decaded before breaking out into full-out wars again. </p>
                            <p>Individual conflicts, as well as casualty and displacement numbers are compiled from Wikipedia's "List of ongoing armed conflicts" and other sources from the web by an AI Agent, and were not reviewed by anyone with the appropriate qualifications, competence or experience.</p>

                            <h3>Sources &amp; methodology</h3>
                            <p>Underlying figures are drawn from a mix of conflict-tracking projects (ACLED, the Uppsala Conflict Data Program), UN agencies (UNHCR for refugees/IDPs, OCHA), and news reporting cited on Wikipedia. Where sources disagree — which is most of the time — a single point estimate was chosen rather than showing every competing figure; the discarded range is usually wider than the number shown suggests.</p>
                            <p>Military/civilian breakdowns are rarely reported directly. Where no split exists, one was estimated from the typical pattern for that kind of conflict (e.g. famine- and disease-driven wars skew heavily civilian). Treat any military/civilian split as an informed guess, not a sourced fact.</p>

                            <h3>Political bias &amp; propaganda</h3>
                            <p>Casualty counts in active conflicts are frequently produced or amplified by parties with a stake in the outcome — governments undercounting to minimize the appearance of losses or atrocities, opposition and humanitarian actors overcounting to mobilize aid or intervention. Independent verification is often impossible in active conflict zones due to access restrictions and contested territory. No figure here should be read as neutral or independently audited.</p>

                            <h3>Belligerents</h3>
                            <p>A country being listed as a belligerent of a given country does not necessarily mean they are a main combatant in the conflict. It merely means they are listed on wikipedia to be, or have been at some point, involved in the conflict in some way or another. They may be part of a coalition or even peace keeping force. They may have supplied combat troop or supporting personell like combat instructors, medical staff etc. They may have been involved only very briefly. The start year of the conflict does not imply the country in question has been involved in the conflict from that year onwards</p>
                            <p>Most of all it makes no claim about the country being the initiator or even aggressor in the conflict.</p>
                            <h3>Time-scope mismatch</h3>
                            <p>Cumulative death tolls span a conflict's entire history — in some cases 70+ years — while refugee and IDP figures are almost always a recent snapshot (typically the last 1–2 years). The two numbers are not on the same time basis and shouldn't be added together.</p>

                            <h3>What "confidence" means</h3>
                            <p>The low/medium tag reflects how wide the disagreement is across sources and how reliable current tracking is — a rough editorial judgment, not a statistical confidence interval.</p>

                            <h3>Per-conflict sources</h3>
                            <p>Each conflict card links to the specific Wikipedia article used for its figures. From there, ACLED (acleddata.com) and UNHCR's Operational Data Portal (data.unhcr.org) are the primary upstream sources for casualty and displacement numbers respectively.</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default OngoingConflicts;
