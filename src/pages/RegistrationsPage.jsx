import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchSupabase } from "../lib/supabase";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getRegistrations() {
      try {
        const response = await fetchSupabase(
          "/registrations?select=id,name,email,status,event:events(title,date)&order=createdAt.desc",
          { signal: controller.signal },
        );
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Could not load registrations", error.details || error);
        setErrorMessage("Tilmeldingerne kunne ikke hentes lige nu.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    getRegistrations();

    return () => controller.abort();
  }, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrations.length} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <table>
            <caption className="sr-only">Alle tilmeldinger</caption>
            <thead>
              <tr className="registration-row registration-labels">
                <th scope="col">Navn</th>
                <th scope="col">Event</th>
                <th scope="col">Dato</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="form-message" colSpan="4" role="status">
                    Henter tilmeldinger...
                  </td>
                </tr>
              )}
              {!isLoading && errorMessage && (
                <tr>
                  <td className="form-message" colSpan="4" role="alert">
                    {errorMessage}
                  </td>
                </tr>
              )}
              {!isLoading && !errorMessage && registrations.length === 0 && (
                <tr>
                  <td className="form-message" colSpan="4">
                    Der er ingen tilmeldinger endnu.
                  </td>
                </tr>
              )}
              {!isLoading && !errorMessage &&
                registrations.map((registration) => (
                  <tr className="registration-row" key={registration.id}>
                    <td>
                      <strong>{registration.name}</strong>
                      <small>{registration.email}</small>
                    </td>
                    <td>{registration.event?.title || "Ukendt event"}</td>
                    <td>
                      {registration.event?.date
                        ? new Date(registration.event.date).toLocaleDateString(
                            "da-DK",
                          )
                        : "-"}
                    </td>
                    <td>
                      <span className="status">{registration.status}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
