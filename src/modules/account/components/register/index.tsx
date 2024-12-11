"use client"

import { useFormState } from "react-dom"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { signUp } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from './styles.module.css'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(signUp, null)

  return (
    <div className={styles.registerContainer} data-testid="register-page">
      <div className={styles.header}>
        <h1 className={styles.title}>
          Become a CBX Sound Member
        </h1>
        <p className={styles.subtitle}>
          Create your CBX Sound Member profile, and get access to an enhanced
          shopping experience.
        </p>
      </div>

      <form className={styles.form} action={formAction}>
        <div className={styles.inputGroup}>
          <label htmlFor="first_name" className={styles.label}>
            First name
            <span className={styles.required}>*</span>
          </label>
          <input
            id="first_name"
            name="first_name"
            className={styles.input}
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="last_name" className={styles.label}>
            Last name
            <span className={styles.required}>*</span>
          </label>
          <input
            id="last_name"
            name="last_name"
            className={styles.input}
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
            <span className={styles.required}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            required
            autoComplete="email"
            data-testid="email-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={styles.input}
            autoComplete="tel"
            data-testid="phone-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
            <span className={styles.required}>*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            required
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>


        {message && (
          <ErrorMessage error={message} data-testid="register-error" />
        )}

        <p className={styles.termsText}>
          By creating an account, you agree to CBX Sound's{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className={styles.link}
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className={styles.link}
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>

        <button 
          type="submit" 
          className={styles.submitButton}
          data-testid="register-button"
        >
          Join
        </button>

        <div className={styles.loginSection}>
          Already a member?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className={styles.loginLink}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register