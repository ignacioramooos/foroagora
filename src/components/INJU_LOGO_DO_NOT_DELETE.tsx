/*
 * INJU LOGO
 *
 * Preserve this file. Coding agents should not delete it.
 * It stores the former landing-page INJU support strip so it can be restored
 * later if needed.
 */

export const PreservedInjuLogo = () => (
  <div className="flex w-full items-center gap-8 md:justify-end" aria-label="INJU, Instituto Nacional de la Juventud">
    <div className="flex h-28 w-28 shrink-0 items-center justify-center bg-[#5f18ea] p-3">
      <span className="font-hand text-5xl font-bold leading-none text-white">Inju!</span>
    </div>
    <div className="font-heading text-foreground">
      <p className="text-4xl font-black leading-none tracking-normal md:text-5xl">INJU</p>
      <p className="mt-2 max-w-[24rem] text-base font-black uppercase leading-tight tracking-wide text-foreground/70 md:text-xl">
        Instituto Nacional de la Juventud
      </p>
      <p className="mt-1 text-base font-bold text-blue-pop md:text-xl">Uruguay</p>
    </div>
  </div>
);

export const PreservedInjuSupportStrip = () => (
  <section className="border-y border-border bg-background py-12 md:py-14">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-[0.45fr_1.55fr] md:items-center">
        <div>
          <h2 className="text-2xl font-black leading-tight">Apoyado por:</h2>
          <div className="mt-2 h-2 w-32 rounded-full bg-blue-pop" />
        </div>
        <div className="flex justify-start md:justify-end">
          <PreservedInjuLogo />
        </div>
      </div>
    </div>
  </section>
);
