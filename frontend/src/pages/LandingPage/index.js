import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import niaLogo from "../../assets/nia-logo.png";
import "./styles.css";

const chatMessages = [
    { type: "in", label: "NUEVO LEAD", text: "Hola! Vi su anuncio de los zapatos. ¿Tienen en talla 38?", time: "10:02" },
    { type: "out", text: "¡Hola María! Claro que sí 😊 Te mando las fotos ahora mismo 📸", time: "10:02 ✓✓" },
    { type: "in", text: "Qué lindos!! ¿Cuánto cuestan?", time: "10:03" },
    { type: "out", text: "RD$1,800 y te hacemos envío gratis hoy 🎁", time: "10:04 ✓✓" },
    { type: "in", text: "¡Perfecto! Los quiero. ¿Cómo pago? 😍", time: "10:04" },
    { type: "out", text: "Te mando el link de pago por aquí. ¡Gracias por elegirnos! 🙌", time: "10:05 ✓✓" },
];

const features = [
    { cls: "b1", icon: "👥", title: "Multi-agente en tiempo real", desc: "Conecta un solo número de WhatsApp y permite que todo tu equipo atienda clientes simultáneamente. Asigna chats, mantén el control y nunca pierdas una oportunidad.", pill: "Trabajo en equipo →" },
    { cls: "b2", icon: "🤖", title: "Automatización", desc: "Configura respuestas rápidas, flujos de integración y chatbots para atender a tus clientes 24/7 sin intervención manual.", pill: "Siempre activo →" },
    { cls: "b3", icon: "📊", title: "Kanban y Embudos", desc: "Visualiza tus ventas. Organiza clientes por etapas, añade etiquetas y no pierdas ninguna oportunidad de cierre.", pill: null },
    { cls: "b4", icon: "📣", title: "Campañas masivas", desc: "Envía mensajes personalizados a cientos de clientes. Promociones, recordatorios y seguimientos automáticos.", pill: "Más alcance →" },
    { cls: "b5", icon: "📈", title: "Analytics", desc: "Tiempos de respuesta, conversiones por agente y rendimiento de campañas. Decisiones basadas en datos reales.", pill: "Ver datos →" },
];

const testimonials = [
    { initials: "CA", text: "Pasamos de responder un cliente a la vez a atender 50 simultáneamente. En el primer mes triplicamos nuestras ventas por WhatsApp.", name: "Carlos Agramonte", role: "CEO, TechStore RD" },
    { initials: "LR", text: "El chatbot trabaja mientras duermo. Mis clientes reciben respuesta inmediata a las 2am y cuando abro ya tienen todo listo para comprar.", name: "Laura Reyes", role: "Dueña, Bella Piel Spa" },
    { initials: "JM", text: "Antes perdíamos clientes por falta de seguimiento. Ahora el Kanban nos dice exactamente en qué etapa está cada uno.", name: "Juan Martínez", role: "Director, Delivery+" },
];

const plans = [
    { name: "Starter", price: "29", period: "/ mes · hasta 3 agentes", feats: ["1 número de WhatsApp", "Hasta 3 agentes", "Respuestas rápidas", "Kanban básico", "Soporte por chat"], featured: false },
    { name: "Pro", price: "79", period: "/ mes · hasta 10 agentes", feats: ["3 números de WhatsApp", "Hasta 10 agentes", "Chatbot con IA", "Campañas masivas", "Analytics avanzados", "Integraciones API"], featured: true },
    { name: "Enterprise", price: "A medida", period: "· agentes ilimitados", feats: ["Números ilimitados", "Agentes ilimitados", "Onboarding dedicado", "SLA garantizado", "Soporte 24/7 prioritario"], featured: false },
];

const logos = ["FashionDom", "TechStore RD", "Bella Piel", "MotoPartes", "GymPro", "Delivery+", "AgroFresh", "MediaFlow"];

const LandingPage = () => {
    const history = useHistory();
    const chatRef = useRef(null);

    // Scroll reveal
    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
        }, { threshold: 0.08 });
        document.querySelectorAll(".rev").forEach((el, i) => { el.style.transitionDelay = (i % 5) * 0.08 + "s"; obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    // Chat animation
    useEffect(() => {
        const body = chatRef.current;
        if (!body) return;
        let idx = 0; let timeout;

        function showTyping() {
            const t = document.createElement("div"); t.className = "typing";
            t.innerHTML = '<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>';
            body.appendChild(t); body.scrollTop = body.scrollHeight; return t;
        }
        function addMsg(m) {
            const d = document.createElement("div"); d.className = "msg msg-" + m.type;
            let h = ""; if (m.label) h += '<div class="msg-lbl">' + m.label + "</div>";
            h += m.text + '<div class="msg-time">' + m.time + "</div>"; d.innerHTML = h;
            body.appendChild(d); body.scrollTop = body.scrollHeight;
            setTimeout(() => { d.style.opacity = "1"; d.style.transform = "translateY(0)"; d.style.transition = "opacity .35s ease,transform .35s ease"; }, 10);
        }
        function next() {
            if (idx >= chatMessages.length) { timeout = setTimeout(() => { body.innerHTML = ""; idx = 0; timeout = setTimeout(next, 600); }, 4500); return; }
            const m = chatMessages[idx]; const t = showTyping();
            timeout = setTimeout(() => { t.remove(); addMsg(m); idx++; timeout = setTimeout(next, 1300); }, m.type === "in" ? 950 : 650);
        }
        timeout = setTimeout(next, 1200);
        return () => clearTimeout(timeout);
    }, []);

    // Google Fonts
    useEffect(() => {
        if (!document.querySelector('link[href*="Plus+Jakarta"]')) {
            const l = document.createElement("link"); l.rel = "stylesheet";
            l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap";
            document.head.appendChild(l);
        }
    }, []);

    return (
        <div className="landing-root">
            <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />

            {/* NAV */}
            <nav className="lp-nav">
                <div className="logo-wrap"><img src={niaLogo} alt="Nia CRM" /><span className="logo-name">Nia CRM</span></div>
                <ul className="nav-links">
                    <li><a href="#features">Funciones</a></li>
                    <li><a href="#how">Cómo funciona</a></li>
                    <li><a href="#pricing">Precios</a></li>
                    <li><a onClick={() => history.push("/login")} className="btn-nav">Iniciar Sesión</a></li>
                </ul>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-badge"><div className="badge-dot" /> CRM #1 para negocios en WhatsApp</div>
                <h1>El CRM perfecto para<br /><span className="h1-purple">tu negocio en WhatsApp</span></h1>
                <p className="hero-sub">Centraliza la comunicación con tus clientes, organiza a tu equipo de ventas y automatiza tus respuestas. Todo desde una plataforma moderna, rápida y diseñada para vender más.</p>
                <div className="hero-actions">
                    <button className="btn-main" onClick={() => history.push("/signup")}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.091.535 4.057 1.474 5.77L0 24l6.39-1.674A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
                        Empieza tus 15 días gratis
                    </button>
                    <a href="#how" className="btn-ghost">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                        Ver cómo funciona
                    </a>
                </div>
                <p className="hero-note">Sin tarjeta de crédito · Fácil configuración · Cancela cuando quieras</p>

                {/* PHONE SCENE */}
                <div className="scene">
                    <div className="scene-glow" />
                    <div className="fb fb1"><div className="fb-ico">⚡</div><div className="fb-val">+38%</div><div className="fb-lbl">Más conversiones</div></div>
                    <div className="fb fb2"><div className="fb-ico">🤖</div><div className="fb-val">24/7</div><div className="fb-lbl">Bot activo</div></div>
                    <div className="phone">
                        <div className="phone-notch"><div className="notch-pill" /></div>
                        <div className="phone-hdr">
                            <div className="ph-av">MF</div>
                            <div><div className="ph-name">María Fernández</div><div className="ph-status">● en línea</div></div>
                            <div className="ph-tag">Agente: Carlos</div>
                        </div>
                        <div className="phone-body" ref={chatRef} />
                        <div className="phone-footer">
                            <div className="ph-input">Escribe una respuesta…</div>
                            <div className="ph-send"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></div>
                        </div>
                    </div>
                    <div className="phone-dash">
                        <div className="dash-hdr"><div className="dash-title">Pipeline — Hoy</div></div>
                        <div className="dash-body">
                            <div><div className="kb-lbl">Nuevos leads</div>
                                <div className="kb-card"><div className="kc-name">María F.</div><div className="kc-val">RD$1,800</div><span className="kc-tag new">Nuevo</span></div>
                                <div className="kb-card pending"><div className="kc-name">Roberto P.</div><div className="kc-val">RD$3,400</div><span className="kc-tag wait">Seguimiento</span></div>
                            </div>
                            <div><div className="kb-lbl">Cerrados hoy</div>
                                <div className="kb-card won"><div className="kc-name">Ana S.</div><div className="kc-val">RD$5,200</div><span className="kc-tag won-tag">✓ Ganado</span></div>
                            </div>
                            <div className="dash-stats">
                                <div className="ds"><div className="ds-val">12</div><div className="ds-lbl">Chats activos</div></div>
                                <div className="ds"><div className="ds-val">3</div><div className="ds-lbl">Agentes</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGOS */}
            <div className="logos rev">
                <p className="logos-lbl">Negocios que confían en Nia CRM</p>
                <div className="logos-track"><div className="logos-scroll">
                    {[...logos, ...logos].map((l, i) => <span className="li" key={i}>{l}</span>)}
                </div></div>
            </div>

            {/* FEATURES */}
            <section id="features" className="sec">
                <div className="eyebrow"><div className="eyebrow-line" />Funcionalidades</div>
                <h2 className="sec-title">Todo lo que necesitas<br />para <em>vender más</em></h2>
                <div className="bento">
                    {features.map((f, i) => (
                        <div className={`bc ${f.cls} rev`} key={i}>
                            <div className="bc-ico">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p>
                            {f.pill && <span className="bc-pill">{f.pill}</span>}
                        </div>
                    ))}
                </div>
            </section>

            {/* METRICS */}
            <div className="metrics">
                <div className="metrics-inner">
                    <div className="mi rev"><span className="mi-val">38%</span><span className="mi-lbl">Más conversiones promedio</span></div>
                    <div className="mi rev"><span className="mi-val">5min</span><span className="mi-lbl">Para configurar todo</span></div>
                    <div className="mi rev"><span className="mi-val">2,400+</span><span className="mi-lbl">Negocios activos</span></div>
                    <div className="mi rev"><span className="mi-val">98%</span><span className="mi-lbl">Satisfacción de clientes</span></div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <section id="how" className="sec">
                <div className="eyebrow"><div className="eyebrow-line" />Proceso</div>
                <h2 className="sec-title">Listo para vender<br />en <em>3 pasos</em></h2>
                <div className="steps">
                    <div className="step rev"><div className="step-n">01</div><h3>Conecta tu WhatsApp</h3><p>Escanea un QR code o conecta la API oficial. Sin instalaciones complicadas. Listo en menos de 5 minutos.</p></div>
                    <div className="step rev"><div className="step-n">02</div><h3>Invita a tu equipo</h3><p>Agrega agentes, asigna roles y configura flujos de atención. Todo el equipo en la misma plataforma.</p></div>
                    <div className="step rev"><div className="step-n">03</div><h3>Empieza a vender</h3><p>Desde el primer día verás la diferencia. Más respuestas rápidas, más clientes satisfechos y más ventas.</p></div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="sec" style={{ paddingTop: 0 }}>
                <div className="eyebrow"><div className="eyebrow-line" />Testimonios</div>
                <h2 className="sec-title">Lo que dicen<br /><em>nuestros clientes</em></h2>
                <div className="testi-grid">
                    {testimonials.map((t, i) => (
                        <div className="tc rev" key={i}>
                            <div className="stars">★★★★★</div>
                            <p className="tc-text">"{t.text}"</p>
                            <div className="tc-author"><div className="tc-av">{t.initials}</div><div><div className="tc-name">{t.name}</div><div className="tc-role">{t.role}</div></div></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="sec" style={{ paddingTop: 0 }}>
                <div className="eyebrow"><div className="eyebrow-line" />Precios</div>
                <h2 className="sec-title">Simple,<br /><em>sin sorpresas</em></h2>
                <div className="price-grid">
                    {plans.map((p, i) => (
                        <div className={`pc rev ${p.featured ? "feat" : ""}`} key={i}>
                            {p.featured && <span className="popular-badge">Más popular</span>}
                            <div className="plan-name">{p.name}</div>
                            <div className="plan-price">{p.price !== "A medida" ? <><sup>$</sup>{p.price}</> : <span style={{ fontSize: 34, paddingTop: 8 }}>A medida</span>}</div>
                            <div className="plan-period">{p.period}</div>
                            <div className="plan-div" />
                            <ul className="plan-feats">{p.feats.map((f, j) => <li className="pf" key={j}><span className="pf-chk">✓</span>{f}</li>)}</ul>
                            <button className={`btn-plan ${p.featured ? "btn-solid" : "btn-outline"}`} onClick={() => history.push("/signup")}>{p.featured ? "Empezar gratis →" : p.price === "A medida" ? "Hablar con ventas" : "Empezar gratis"}</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <div className="cta-wrap">
                <div className="cta-box rev">
                    <div className="cta-glow" />
                    <h2>Empieza hoy.<br /><span className="h1-purple">15 días gratis.</span></h2>
                    <p>Sin tarjeta de crédito. Sin compromisos. Solo tu negocio vendiendo más desde el primer día.</p>
                    <div className="cta-acts">
                        <button className="btn-main" style={{ fontSize: "15.5px", padding: "17px 38px" }} onClick={() => history.push("/signup")}>Crear mi cuenta gratis</button>
                        <a href="#how" className="btn-ghost">Ver cómo funciona →</a>
                    </div>
                    <p className="cta-fine">Sin tarjeta de crédito · Fácil configuración · Soporte en español</p>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="lp-footer">
                <div className="logo-wrap"><img src={niaLogo} alt="Nia CRM" /><span className="logo-name">Nia CRM</span></div>
                <p className="foot-copy">© {new Date().getFullYear()} Nia CRM. Todos los derechos reservados.</p>
                <div className="foot-links"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Soporte</a></div>
            </footer>
        </div>
    );
};

export default LandingPage;
