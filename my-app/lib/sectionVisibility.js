/**
 * Section Visibility Helper
 * 
 * Checks whether a section should be rendered on the frontend
 * based on the `_sectionVisibility` map stored in each page's JSON data.
 * 
 * Default behavior: if `_sectionVisibility` is not present or
 * a section key is not listed, the section is treated as visible (backward compatible).
 */

/**
 * Check if a section is visible based on _sectionVisibility map.
 * @param {Object} data - The full page data object (e.g., homepage.json content)
 * @param {string} sectionKey - The key of the section to check (e.g., 'hero', 'testimonials')
 * @returns {boolean} true if the section should be rendered
 */
export function isSectionVisible(data, sectionKey) {
  if (!data?._sectionVisibility) return true;
  const visibility = data._sectionVisibility[sectionKey];
  return visibility !== false; // default true if not explicitly set to false
}
