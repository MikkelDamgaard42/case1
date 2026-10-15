import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchSupabase } from "../lib/supabase";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getEvents() {
      try {
        const response = await fetchSupabase(
          "/events?select=id,title,summary,date,category,image,venue:venues(name)&order=date.asc",
          { signal: controller.signal },
        );
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Could not load events", error.details || error);
        setErrorMessage("Events kunne ikke hentes lige nu. Prøv igen senere.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    getEvents();

    return () => controller.abort();
  }, []);

  const categories = ["Alle", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const searchText = `${event.title} ${event.summary} ${event.venue?.name || ""}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label htmlFor="event-search">
            Søg
            <input
              type="search"
              id="event-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label htmlFor="event-category">
            Kategori
              <select
                id="event-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="event-grid">
          {isLoading && (
            <p className="form-message" role="status">
              Henter events...
            </p>
          )}
          {!isLoading && errorMessage && (
            <p className="form-message" role="alert">
              {errorMessage}
            </p>
          )}
          {!isLoading && !errorMessage && events.length === 0 && (
            <p className="form-message">Der er ingen events endnu.</p>
          )}
          {!isLoading && !errorMessage && events.length > 0 && filteredEvents.length === 0 && (
            <p className="form-message">Ingen events matcher din søgning.</p>
          )}
          {!isLoading && !errorMessage && filteredEvents.map((event) => (
            <article className="event-card" key={event.id}>
              <img src={event.image} alt={event.title} loading="lazy" />
              <div className="event-card-content">
                <p className="event-category">{event.category}</p>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <div className="event-meta">
                  <span>{formatEventDate(event.date)}</span>
                  <span>{event.venue?.name || "Sted ikke angivet"}</span>
                </div>
                <Link className="card-link" to={`/events/${event.id}`}>
                  Læs mere
                </Link>
              </div>
            </article>
          ))}
        </section>
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
          <p className="footer-meta">© 2026 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
