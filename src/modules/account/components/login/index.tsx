import React from 'react'
import { useFormState } from 'react-dom'
import { LOGIN_VIEW } from '@modules/account/templates/login-template'
import { logCustomerIn } from '@modules/account/actions'
import ErrorMessage from '@modules/checkout/components/error-message'
import styles from './styles.module.css'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(logCustomerIn, null)
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={styles.loginContainer} data-testid="login-page">
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Sign in to access an enhanced shopping experience
        </p>
      </div>

      <form className={styles.form} action={formAction}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
            placeholder="name@example.com"
            data-testid="email-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordContainer}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className={styles.input}
              data-testid="password-input"
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {message && (
          <ErrorMessage error={message} data-testid="login-error-message" />
        )}

        <button
          type="submit"
          className={styles.submitButton}
          data-testid="sign-in-button"
        >
          Sign in
        </button>

        <div className={styles.registerSection}>
          Not a member?{' '}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className={styles.registerLink}
            data-testid="register-button"
          >
            Join us
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login