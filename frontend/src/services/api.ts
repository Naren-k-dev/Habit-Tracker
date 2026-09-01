const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token =
    localStorage.getItem(
      "access_token"
    );


  const headers =
    new Headers(
      options.headers
    );


  // ==========================================
  // CONTENT TYPE
  // ==========================================

  if (options.body) {

    headers.set(
      "Content-Type",
      "application/json"
    );

  }


  // ==========================================
  // AUTHORIZATION
  // ==========================================

  if (token) {

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

  }


  // ==========================================
  // REQUEST
  // ==========================================

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );


  // ==========================================
  // ERROR HANDLING
  // ==========================================

  if (!response.ok) {

    let errorMessage =
      "Something went wrong";


    try {

      const errorData =
        await response.json();


      if (
        typeof errorData.detail ===
        "string"
      ) {

        errorMessage =
          errorData.detail;

      }


      /*
       * FastAPI validation errors
       * usually return detail as an array.
       */

      else if (
        Array.isArray(
          errorData.detail
        )
      ) {

        const firstError =
          errorData.detail[0];


        if (
          firstError &&
          typeof firstError.msg ===
            "string"
        ) {

          errorMessage =
            firstError.msg;

        }

      }

    } catch {

      // Ignore invalid/empty response

    }


    /*
     * If the token has expired,
     * clear it so the protected
     * route can redirect to login.
     */

    if (
      response.status === 401
    ) {

      localStorage.removeItem(
        "access_token"
      );

    }


    throw new Error(
      errorMessage
    );

  }


  // ==========================================
  // NO CONTENT
  // ==========================================

  if (
    response.status === 204
  ) {

    return undefined as T;

  }


  // ==========================================
  // READ RESPONSE
  // ==========================================

  const text =
    await response.text();


  if (!text.trim()) {

    return undefined as T;

  }


  // ==========================================
  // PARSE JSON
  // ==========================================

  try {

    return JSON.parse(
      text
    ) as T;

  } catch {

    throw new Error(
      "Server returned an invalid response."
    );

  }

}