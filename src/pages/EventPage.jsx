import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchSupabase } from "../lib/supabase";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [eventNotFound, setEventNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function getEvent() {
      try {
        const response = await fetchSupabase(
          `/events?select=id,title,summary,description,date,category,image,price,venue:venues(name,address,postalCode,city,website)&id=eq.${eventId}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        setEvent(data[0] || null);
        setEventNotFound(data.length === 0);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Could not load event", error.details || error);
        setLoadError("Eventet kunne ikke hentes lige nu. Prøv igen senere.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    getEvent();

    return () => controller.abort();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    if (submissionStatus === "loading") {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setSubmissionStatus("error");
      setSubmissionMessage(
        "Indtast venligst et navn og en gyldig e-mailadresse.",
      );
      return;
    }

    setSubmissionStatus("loading");
    setSubmissionMessage("");

    try {
      const response = await fetchSupabase("/registrations", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          status: "Ny",
          eventId,
        }),
      });

      if (!response.ok) {
        const responseBody = await response.text();
        console.error("Supabase registration failed", {
          status: response.status,
          statusText: response.statusText,
          responseBody,
        });
        throw new Error(
          `Registration request failed with status ${response.status}`,
        );
      }

      setName("");
      setEmail("");
      setSubmissionStatus("success");
      setSubmissionMessage("Tak for din tilmelding. Din plads er reserveret.");
    } catch (error) {
      console.error("Could not save registration", error);
      setSubmissionStatus("error");
      setSubmissionMessage("Tilmeldingen kunne ikke gemmes. Prøv igen.");
    }
  }

  const date = event ? new Date(event.date) : null;

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        {isLoading && <p className="form-message" role="status">Henter event...</p>}
        {!isLoading && loadError && (
          <p className="form-message" role="alert">{loadError}</p>
        )}
        {!isLoading && !loadError && eventNotFound && (
          <section className="form-message" aria-labelledby="event-not-found-title">
            <h1 id="event-not-found-title">Eventet blev ikke fundet</h1>
            <p>Det event, du leder efter, findes ikke længere.</p>
          </section>
        )}
        {!isLoading && !loadError && event && <section className="event-detail">
          <img src={event.image} alt={event.title} />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                {event.venue ? (
                  <span>
                    {event.venue.name}
                    <br />
                    {event.venue.address}, {event.venue.postalCode}{" "}
                    {event.venue.city}
                    {event.venue.website && (
                      <>
                        <br />
                        <a href={event.venue.website}>Besøg venue</a>
                      </>
                    )}
                  </span>
                ) : (
                  <span>Sted ikke angivet</span>
                )}
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>}

        {!isLoading && !loadError && event && <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="registration-name">
              Navn
              <input
                id="registration-name"
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label htmlFor="registration-email">E-mail</label>
            <input
              id="registration-email"
              type="email"
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
              autoComplete="email"
              required
            />
            <button type="submit" disabled={submissionStatus === "loading"}>
              {submissionStatus === "loading" ? "Tilmelder..." : "Tilmeld mig"}
            </button>
            {submissionMessage && (
              <p
                className="form-message"
                role={submissionStatus === "error" ? "alert" : "status"}
                aria-live={submissionStatus === "error" ? "assertive" : "polite"}
              >
                {submissionMessage}
              </p>
            )}
          </form>
        </section>}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
