export default {
  // UI elements
  ui: {
    // States
    states: {
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      empty: 'No data',
    },

    // Actions and buttons (combined)
    actions: {
      // Common actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      apply: 'Apply',
      reset: 'Reset',
      search: 'Search',
      select: 'Select',
      clear: 'Clear',
      submit: 'Submit',
      confirm: 'Confirm',

      // Authentication buttons
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      goToLogin: 'Already have an account? Login',
      goToRegister: 'Register',
      forgotPassword: 'Forgot password?',
      changePassword: 'Change password',

      // Navigation actions
      goBack: 'Back',
      goForward: 'Forward',
      returnHome: 'Return to home',

      // Filters and sorting
      filter: 'Filter',
      sort: 'Sort',
      showFilters: 'Show filters',
      hideFilters: 'Hide filters',

      // Date operations
      selectDate: 'Select date',
      setDateRange: 'Set date range',
    },

    // Pagination (combined)
    pagination: {
      show: 'Show',
      prev: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      total: 'Total',
      perPage: 'entries per page',
      entries: {
        one: 'entry',
        few: 'entries',
        many: 'entries',
      },
    },
  },

  // Form fields (combined)
  fields: {
    // User fields
    firstName: 'First name',
    lastName: 'Last name',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm password',
    oldPassword: 'Current password',
    newPassword: 'New password',
    role: 'Role',
    birthDate: 'Date of birth',
    documentType: 'Document type',
    documentNumber: 'Document number',

    // Event fields
    title: 'Title',
    description: 'Description',
    location: 'Location',
    date: 'Date',
    startDate: 'Start date',
    endDate: 'End date',
    time: 'Time',
    startTime: 'Start time',
    endTime: 'End time',
    price: 'Price',
    minPrice: 'Price from',
    maxPrice: 'Price to',
    ticketCount: 'Number of tickets',

    // Placeholders
    placeholders: {
      search: 'Search...',
      title: 'Enter title...',
      location: 'Enter location...',
      dateRange: 'Select date range',
      minPrice: 'Minimum',
      maxPrice: 'Maximum',
      email: 'example@email.com',
      phone: '+1 (XXX) XXX-XXXX',
    },
  },

  // Document types
  documentTypes: {
    passport: 'Passport',
    driverLicense: "Driver's License",
    foreignPassport: 'Foreign Passport',
    studentCard: 'Student Card',
    birthCertificate: 'Birth Certificate',
    unknown: 'Unknown document type'
  },

  // Validation
  validation: {
    // Common messages
    required: 'Required field',
    minLength: 'Minimum {length} characters',
    maxLength: 'Maximum {length} characters',
    pattern: 'Invalid format',
    date: 'Invalid date format', // Add this line

    // Specific validations
    name: {
      required: 'Please provide a name',
      minLength: 'Name must be at least 3 characters long',
      maxLength: 'Name can be up to 50 characters long',
      uppercase: 'Name must start with an uppercase letter',
      pattern: 'Only letters are allowed',
    },

    lastName: {
      required: 'Please provide a last name',
      minLength: 'Last name must be at least 3 characters long',
      maxLength: 'Last name can be up to 50 characters long',
      uppercase: 'Last name must start with an uppercase letter',
      pattern: 'Only letters are allowed',
    },

    fullName: {
      required: 'Please provide a full name',
      wordsCount: 'Full name must consist of 2 to 3 words',
      wordLength: 'Each word must be at least 3 characters long',
      uppercase: 'Each word must start with an uppercase letter',
      lettersOnly: 'Only letters are allowed',
      pattern: 'Full name format: First Last [Middle]',
    },

    email: {
      required: 'Please provide an email',
      invalid: 'Invalid email format',
    },

    phone: {
      required: 'Please provide a phone number',
      pattern: 'Invalid phone number format',
    },

    password: {
      required: 'Please provide a password',
      confirmRequired: 'Please confirm your password',
      minLength: 'Password must be at least {length} characters long',
      uppercase: 'Password must contain at least one uppercase letter',
      digit: 'Password must contain at least one digit',
      special: 'Password must contain at least one special character',
      pattern: 'Password does not meet security requirements',
      mismatch: 'Passwords do not match',
    },

    document: {
      passport: 'Enter a valid passport number (10 digits, e.g.: 1234 567890)',
      driverLicense: 'Enter a valid driver\'s license number (10 digits)',
      studentCard: 'Enter a valid student card number',
    },

    // Language restrictions
    onlyRussian: 'Only Russian letters are allowed',
    onlyEnglish: 'Only English letters are allowed',

    // Additional validations
    maxDate: 'Date cannot be in the future',

    // Add birthDate validation messages
    birthDate: {
      range: 'Age must be between {min} and {max} years',
      invalid: 'Invalid date of birth',
      min: 'Minimum age is {min} years',
      max: 'Maximum age is {max} years'
    },

    // Add document pattern validations
    passport: {
      pattern: 'Invalid passport format (example: 1234 567890)'
    },
    driverLicense: {
      pattern: 'Invalid driver\'s license format'
    },
    foreignPassport: {
      pattern: 'Invalid foreign passport format'
    },
    studentCard: {
      pattern: 'Invalid student card format'
    },
    birthDocument: {
      pattern: 'Invalid birth certificate format'
    },
    positive: 'Value must be greater than 0',
  },

  // Errors (combined)
  errors: {
    // Common errors
    general: 'An error occurred',
    unexpected: 'Unexpected error',
    formHasErrors: 'Please correct the errors in the form',
    submitError: 'Error submitting data',
    operationFailed: 'Operation failed',
    networkError:
      'Could not connect to the server. Check your internet connection or try again later',
    notFound: 'Resource not found',
    serverError: 'Server error',
    badRequest: 'Invalid request',

    // Authentication errors
    auth: {
      emailAlreadyExists: 'A user with this email already exists',
      invalidCredentials: 'Invalid email or password',
      unauthorized: 'Authorization required',
      forbidden: 'Access denied',
      sessionExpired: 'Session expired, please log in again',
      loginError: 'Error logging in',
      registerError: 'Error registering',
      passwordChangeError: 'Could not change password',
    },

    // Entity errors
    entities: {
      event: {
        notFound: 'Event not found',
        alreadyExists: 'An event with this title already exists',
        loadError: 'Error loading events',
        createError: 'Error creating event',
        updateError: 'Error updating event',
        deleteError: 'Error deleting event',
      },
      user: {
        notFound: 'User not found',
        loadError: 'Error loading users',
        updateError: 'Error updating user',
        deleteError: 'Error deleting user',
      },
      ticket: {
        notFound: 'Ticket not found',
        loadError: 'Error loading tickets',
        createError: 'Error creating ticket',
        updateError: 'Error updating ticket',
        deleteError: 'Error deleting ticket',
        reserveError: 'Error reserving ticket',
        alreadyReserved: 'This ticket is already reserved',
        alreadyPaid: 'This ticket is already paid',
        alreadyUsed: 'This ticket is already used',
      },
      payment: {
        notFound: 'Payment not found',
        loadError: 'Error loading payments',
        createError: 'Error creating payment',
        updateError: 'Error updating payment',
        deleteError: 'Error deleting payment',
        paymentFailed: 'Error processing payment',
      },
      image: {
        notFound: 'Image not found',
        loadError: 'Error loading images',
        uploadError: 'Error uploading image',
        updateError: 'Error updating image',
        deleteError: 'Error deleting image',
        invalidFileType: 'Invalid file type. Only images are supported',
        fileSizeExceeded: 'File size exceeds the allowed limit',
      },
      calendar: {
        notFound: 'Calendar not found',
        eventNotFound: 'Event in calendar not found',
        loadError: 'Error loading calendar',
        addError: 'Error adding event to calendar',
        updateError: 'Error updating event in calendar',
        deleteError: 'Error deleting event from calendar',
      },
      attendee: {
        notFound: 'Attendee not found',
        loadError: 'Could not load attendees',
      },
    },
  },

  // Success messages (combined)
  success: {
    // Common messages
    submitSuccess: 'Data submitted successfully',
    operationSuccess: 'Operation completed successfully',

    // Authentication
    auth: {
      loginSuccess: 'You have successfully logged in',
      registerSuccess: 'Registration completed successfully',
      passwordChanged: 'Password changed successfully',
      logoutSuccess: 'You have logged out',
    },

    // Successful entity operations
    entities: {
      event: {
        createSuccess: 'Event created successfully',
        updateSuccess: 'Event updated',
        deleteSuccess: 'Event deleted',
      },
      user: {
        updateSuccess: 'User data updated',
        deleteSuccess: 'User deleted',
        profileUpdated: 'Profile updated successfully',
        accountDeleted: 'Account deleted successfully',
      },
      ticket: {
        createSuccess: 'Ticket created successfully',
        updateSuccess: 'Ticket updated successfully',
        deleteSuccess: 'Ticket deleted',
        reserveSuccess: 'Ticket reserved successfully',
      },
      payment: {
        createSuccess: 'Payment created successfully',
        updateSuccess: 'Payment updated',
        deleteSuccess: 'Payment deleted',
        paymentSuccessful: 'Payment processed successfully',
      },
      image: {
        uploadSuccess: 'Image uploaded successfully',
        updateSuccess: 'Image updated',
        deleteSuccess: 'Image deleted',
      },
      calendar: {
        eventAddSuccess: 'Event added successfully',
        eventUpdateSuccess: 'Event in calendar updated',
        eventDeleteSuccess: 'Event deleted from calendar',
      },
      attendee: {
        createSuccess: 'Attendee added successfully',
        updateSuccess: 'Attendee data updated',
        deleteSuccess: 'Attendee deleted',
      },
    },
  },

  // Statuses (combined)
  statuses: {
    // Payments
    payment: {
      Pending: 'Pending payment',
      WaitingForCapture: 'Waiting for confirmation',
      Succeeded: 'Paid',
      Canceled: 'Canceled',
      Failed: 'Payment error',
      awaitingPayment: 'Awaiting payment',
      paymentCanceled: 'Payment canceled',
      0: 'Pending payment',
      1: 'Paid',
      2: 'Canceled',
      3: 'Error',
    },

    // Tickets
    ticket: {
      Available: 'Available',
      Reserved: 'Reserved',
      Paid: 'Paid',
      Used: 'Used',
      Cancelled: 'Cancelled',
      Expired: 'Expired',
    },
  },

  // Application modules
  modules: {
    // Pages and titles
    pages: {
      home: 'Home',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      events: 'Events',
      eventDetails: 'Event Details',
      createEvent: 'Create Event',
      tickets: 'Tickets',
      dashboard: 'Dashboard',
    },

    // Authentication
    auth: {
      title: {
        login: 'Login',
        register: 'Register',
        changePassword: 'Change password',
      },
      termsAgreement: 'I accept the terms of use',
      unauthenticated: 'You need to log in',
    },

    // Filters and sorting
    filters: {
      title: 'Title',
      titlePlaceholder: 'Search by title',
      location: 'Location',
      locationPlaceholder: 'Search by location',
      dateRange: 'Period',
      dateRangePlaceholder: 'Select dates',
      tag: 'Category',
      allTags: 'All categories',
      minPrice: 'Price from',
      minPricePlaceholder: 'Minimum',
      maxPrice: 'Price to',
      maxPricePlaceholder: 'Maximum',
      onlyActive: 'Only active',
      reset: 'Reset',
      apply: 'Apply',
      select: 'Select',
      search: 'Search',
      from: 'From',
      to: 'To',
      selectDate: 'Select date',
    },

    // Date picker component
    datePicker: {
      selectDate: 'Select date',
      selectDateRange: 'Select date range',
      time: 'Time',
      startTime: 'Start time',
      endTime: 'End time',
      from: 'From',
      to: 'To',
      apply: 'Apply',
      clear: 'Clear',
    },

    // Events
    events: {
      title: 'Events',
      inactive: 'Inactive',
      free: 'Free',
      moreDetails: 'More details',
      buyTicket: 'Buy',
      found: '{count} events found',
      noEvents: 'No events found',
      tryDifferentFilters: 'Try changing the search parameters',
      time: {
        hours: 'h',
        minutes: 'min',
        duration: 'Duration',
      },
      tags: {
        concert: 'Concert',
        festival: 'Festival',
        exhibition: 'Exhibition',
        theater: 'Theater',
        sport: 'Sport',
        workshop: 'Workshop',
        other: 'Other',
      },
      filters: {
        title: 'Title',
        titlePlaceholder: 'Search by title',
        location: 'Location',
        locationPlaceholder: 'Search by location',
        dateRange: 'Period',
        dateRangePlaceholder: 'Select dates',
        tag: 'Category',
        allTags: 'All categories',
        minPrice: 'Price from',
        minPricePlaceholder: 'Minimum',
        maxPrice: 'Price to',
        maxPricePlaceholder: 'Maximum',
        onlyActive: 'Only active',
        reset: 'Reset',
        apply: 'Apply',
        showFilters: 'Show filters',
        hideFilters: 'Hide filters',
      },
    },

    // Footer
    footer: {
      contacts: {
        title: 'Contacts',
        address: 'Russian Federation,',
        city: 'Moscow, Event Street, 123',
        general: 'General inquiries, cooperation, and feedback:',
        support: 'Support service:',
        website: 'Official website:',
      },
      hours: {
        title: 'Working hours',
        summer: 'From May to September:',
        summerTime: 'From 08:00 to 24:00',
        summerEntry: 'Entry to the territory is possible until 23:00',
        winter: 'From October to April:',
        winterTime: 'From 09:00 to 22:00',
        winterEntry: 'Entry to the territory is possible until 21:00',
      },
      legal: {
        title: 'Legal information',
        fullName:
          'Full name: Autonomous non-profit organization "Event Center"',
        shortName: 'Short name: ANO "EC"',
        address: 'Address: 123456, Moscow, Event Street, 123',
        ogrnTitle: 'OGRN:',
        ogrn: '1234567890123',
        kppTitle: 'KPP:',
        kpp: '123456789',
        innTitle: 'INN:',
        inn: '1234567890',
      },
      copyright: 'All rights reserved.',
      allRightsReserved: 'All rights reserved.',
    },
  },

  // Error pages
  errorPages: {
    notFound: {
      title: 'Page not found',
      message: 'Sorry, the requested page does not exist',
      returnHome: 'Return to home',
    },
    unauthorized: {
      title: 'Access denied',
      message: 'You do not have permission to access this page.',
      returnHome: 'Return to home',
      logout: 'Logout',
    },
  },

  // Formatting
  formatter: {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekdayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    currency: {
      RUB: '₽',
      USD: '$',
      EUR: '€',
    },
  },

  // Dialogs
  dialogs: {
    confirm: {
      title: 'Confirmation',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    deleteConfirmation: {
      title: 'Deletion',
      message: 'Are you sure you want to delete this item?',
      confirmButton: 'Delete',
      cancelButton: 'Cancel',
    },
    userDeleteConfirmation:
      'Are you sure you want to delete your account? This action cannot be undone.',
  },

  // Buttons
  common: {
    buttons: {
      goBack: 'Back',
      register: 'Register',
      goToLogin: 'Login',
      login: 'Login',
      'goToRegister': 'Register',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete', // Add this line
    },
    errors: {
      error: 'Error',
      formHasErrors: 'Please correct the errors in the form',
      networkError: 'Network error',
    },
    success: {
      registerSuccess: 'Registration completed successfully',
      loginSuccess: 'You have successfully logged in',
    },
    language: 'Language',
    yes: 'Yes',
    no: 'No',
    changesDiscarded: 'Changes discarded',
    cancel: 'Cancel',
    noData: '-',
  },

  pagination: {
    show: 'Show',
    prev: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    total: 'Total',
    perPage: 'entries per page',
    entries: {
      one: 'entry',
      few: 'entries',
      many: 'entries',
    },
  },

  // Tickets
  tickets: {
    price: 'Price',
    duration: 'Duration',
    purchase: {
      title: 'Ticket purchase',
      description: 'Fill in the information for each ticket',
      ticket: 'Ticket',
      ticketsCount: '{count} ticket(s)',
      maxTickets: 'Maximum {max} tickets per order',
      submit: 'Buy {count} ticket(s) for {price}',
      success: 'You have successfully purchased {count} ticket(s)',
      error: 'Error purchasing tickets',
      noAvailableTickets: 'No available tickets',
      reserveError: 'Error reserving ticket',
    },
  },

  // User profile
  profile: {
    title: 'Personal account',
    menu: {
      info: 'My profile',
      tickets: 'My tickets',
      calendar: 'My calendar',
    },
    info: {
      title: 'Profile information',
      editProfile: 'Edit profile',
      changePassword: 'Change password',
      saveChanges: 'Save changes',
      cancel: 'Cancel',
      updateSuccess: 'Profile updated successfully',
      updateError: 'Error updating profile',
    },
    password: {
      title: 'Change password',
      change: 'Change password',
      success: 'Password changed successfully',
      error: 'Error changing password',
    },
    tickets: {
      title: 'My tickets',
      comingSoon: 'Your ticket list will be available soon!',
      noTickets: 'You have no tickets yet',
      buyTicketsMessage: 'Visit the events page to purchase tickets',
      browseEvents: 'Browse events',
      filter: 'Filter',
      allStatuses: 'All statuses',
      sort: 'Sort',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      sortByEvent: 'By event name',
      ticketDetails: 'Ticket details',
      eventDetails: 'Event information',
      attendeeDetails: 'Attendee information',
      view: 'View',
      download: 'Download',
      downloadStarted: 'Ticket download started',
      unknownEvent: 'Unknown event',
      locationUnknown: 'Location not specified',
      attendeeUnknown: 'Attendee not specified',
      ticketStatus: 'Ticket status',
      eventInactive: 'Event inactive',
      eventPassed: 'Event passed',
    },
    calendar: {
      title: 'My event calendar',
      comingSoon: 'Event calendar will be available soon!',
      today: 'Today',
      withReminder: 'With reminder',
      withNote: 'With note',
      standard: 'Standard',
      inactive: 'Inactive',
      active: 'Active',
      description: 'Description',
      note: 'Note',
      notePlaceholder: 'Enter a note...',
      reminder: 'Reminder',
      enableReminder: 'Enable reminder',
      goToEvent: 'Go to event',
      save: 'Save',
      setReminder: 'Set reminder',
      eventAddSuccess: 'Event added successfully',
      eventAdded: 'Event added to calendar',
    }
  },

  // Users
  user: {
    roles: {
      admin: 'Admin',
      user: 'User',
      unknown: 'Unknown role',
    },
    id: 'Identifier',
    fullName: 'Full name',
    email: 'Email',
    role: 'Role',
    phone: 'Phone',
    birthDate: 'Date of birth',
    edit: 'Edit user',
    create: 'Create user',
    createSuccess: 'User created successfully',
    updateSuccess: 'User updated successfully',
    fields: {
      fullName: 'Full name',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
      birthDate: 'Date of birth',
      password: 'Password',
    },
    assignedAttendees: 'Assigned attendees',
    noAttendees: 'No assigned attendees',
    addAttendee: 'Add attendee',
  },

  // Navigation
  navbar: {
    searchEvents: 'Search events',
    searchHint: 'Quick search',
    viewAllResults: 'View all results',
    noResults: 'No events found',
    events: 'Events',
    dashboard: 'Dashboard',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    mainSite: 'Go to main site',
  },

  //Dashboard
  dashboard: {
    title: 'Dashboard',
    menu: {
      events: 'Events',
      users: 'Users',
      tickets: 'Tickets',
      pages: 'Pages',
      attendees: 'Attendees',
      home: 'Home',
      logout: 'Logout',
    },
    users: {
      tableTitle: 'System users',
      deleteConfirmTitle: 'Delete user',
      deleteConfirmMessage: 'Do you really want to delete this user? This action cannot be undone.',
    },
    tickets: {
      tableTitle: 'Manage tickets',
    },
    attendees: {
      tableTitle: 'Manage attendees',
      deleteConfirmTitle: 'Delete attendee',
      deleteConfirmMessage: 'Do you really want to delete this attendee? This action cannot be undone.',
    },
    events: {
      tableTitle: 'Manage events',
      deleteConfirmTitle: 'Delete event',
      deleteConfirmMessage: 'Do you really want to delete this event? This action cannot be undone.',
    },
    pages: {
      title: 'Pages',
      description: 'Manage website pages',
    },
  },

  // Pagination
  basePagination: {
    show: 'Show',
    prev: 'Back',
    next: 'Forward',
  },

  // AdminDataTable
  adminDataTable: {
    applyFilters: 'Apply filters',
    resetFilters: 'Reset filters',
    noData: 'No data to display',
    loading: 'Loading data...',
    error: 'Error loading data',
    noDataDescription: 'Please check the filters or add new data.',
    add: 'Add',
    edit: 'Edit',
    actions: 'Actions',
    confirmDelete: 'Are you sure you want to delete this item?',
    confirmDeleteDescription: 'This action cannot be undone.',
    delete: 'Delete',
  },

  //Events
  event: {
    id: 'Identifier',
    title: 'Event',
    startTime: 'Start',
    endTime: 'End',
    location: 'Location',
    description: 'Description',
    tags: 'Categories',
    price: 'Price',
    active: 'Active event',
    edit: 'Edit event',
    create: 'Create event',
    fields: {
      title: 'Event title',
      description: 'Event description',
      location: 'Location',
      startDate: 'Start date',
      endDate: 'End date',
      tag: 'Categories',
      price: 'Price',
      ticketsCount: 'Number of tickets',
      isActive: 'Active event',
      images: 'Images',
    },
    addImage: 'Add image',
    updateFailed: 'Failed to update data',
  },

  //Tickets
  ticket: {
    id: 'Identifier',
    eventId: 'Event identifier',
    buyerName: 'Buyer name',
    attendeeName: 'Attendee name',
    edit: 'Edit ticket',
    create: 'Create ticket',
    selectEvent: 'Select event',
    payment: 'Payment',
    fields: {
      eventId: 'Event',
      status: 'Status',
      attendeeId: 'Attendee',
      buyerId: 'Buyer',
      qrCode: 'QR code',
    },
    status: {
      active: 'Active',
      used: 'Used',
      cancelled: 'Cancelled',
      expired: 'Expired',
      title: 'Status',
    },
    noAttendee: 'Attendee not selected',
    noBuyer: 'Buyer not selected',
  },

  attendee: {
    id: 'Identifier',
    fullName: 'Full name',
    birthDate: 'Date of birth',
    docType: 'Document type',
    docNumber: 'Document number',
    create: 'Create attendee',
    edit: 'Edit attendee',
    fields: {
      fullName: 'Full name',
      birthDate: 'Date of birth',
      documentType: 'Document type',
      documentNumber: 'Document number',
    },
    docTypes: {
      passport: 'Passport',
      birthCertificate: 'Birth certificate',
      other: 'Other',
    },
  },

  //Filters in dashboard
  filters: {
    event: {
      title: 'Event title',
      location: 'Location',
      tag: 'Categories',
      dateRange: 'Event period',
      minPrice: 'Price from',
      maxPrice: 'Price to',
      active: 'Active event',
    },
    user: {
      fullName: 'Full name',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
      birthDate: 'Date of birth',
      createdAt: 'Registration date',
      roles: 'Roles',
    },
    ticket: {
      buyerName: 'Buyer name',
      attendeeName: 'Attendee name',
      status: 'Ticket status',
      eventId: 'Event identifier',
      buyerId: 'Buyer identifier',
      attendeeId: 'Attendee identifier',
      paymentId: 'Payment identifier',
    },
    attendee: {
      fullName: 'Full name',
      birthDate: 'Date of birth',
      docType: 'Document type',
      docNumber: 'Document number',
      ids: 'Identifiers', // Add this line
    },
    select: 'Select',
    all: 'All',
  },

  // Date picker component
  datePicker: {
    selectDate: 'Select date',
    selectDateRange: 'Select date range',
    time: 'Time',
    startTime: 'Start time',
    endTime: 'End time',
    from: 'From',
    to: 'To',
    apply: 'Apply',
    clear: 'Clear',
  },
  // Pages and titles
  pages: {
    home: 'Home',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    events: 'Events',
    eventDetails: 'Event Details',
    createEvent: 'Create Event',
    tickets: 'Tickets',
    dashboard: 'Dashboard',
  },
  auth: {
    login: {
      error: 'Error logging in. Please check your credentials and try again.',
    },
  },

  // Footer
  footer: {
    contacts: {
      title: 'Contacts',
      address: 'Russian Federation,',
      city: 'Moscow, Event Street, 123',
      general: 'General inquiries, cooperation, and feedback:',
      support: 'Support service:',
      website: 'Official website:',
    },
    hours: {
      title: 'Working hours',
      summer: 'From May to September:',
      summerTime: 'From 08:00 to 24:00',
      summerEntry: 'Entry to the territory is possible until 23:00',
      winter: 'From October to April:',
      winterTime: 'From 09:00 to 22:00',
      winterEntry: 'Entry to the territory is possible until 21:00',
    },
    legal: {
      title: 'Legal information',
      fullName:
        'Full name: Autonomous non-profit organization "Event Center"',
      shortName: 'Short name: ANO "EC"',
      address: 'Address: 123456, Moscow, Event Street, 123',
      ogrnTitle: 'OGRN:',
      ogrn: '1234567890123',
      kppTitle: 'KPP:',
      kpp: '123456789',
      innTitle: 'INN:',
      inn: '1234567890',
    },
    copyright: 'All rights reserved.',
    allRightsReserved: 'All rights reserved.',
  },

  documentType: {
    passport: 'Passport',
    driverLicense: 'Driver\'s License',
    foreignPassport: 'Foreign Passport',
    studentCard: 'Student Card',
    birthCertificate: 'Birth Certificate',
  },

  roles: {
    admin: 'Admin',
    user: 'User',
  },

  notFound: {
      title: 'Page not found',
      message: 'Sorry, the requested page does not exist',
      returnHome: 'Return to home',
    },
    unauthorized: {
      title: 'Access denied',
      message: 'You do not have permission to access this page.',
      returnHome: 'Return to home',
      logout: 'Logout',
    },
    calendar: {
      eventAddSuccess: 'Event added successfully',
      today: 'Today',
      withReminder: 'With reminder',
      withNote: 'With note',
      standard: 'Standard',
      inactive: 'Inactive',
      active: 'Active',
      description: 'Description',
      note: 'Note',
      notePlaceholder: 'Enter a note...',
      reminder: 'Reminder',
      enableReminder: 'Enable reminder',
      goToEvent: 'Go to event',
      save: 'Save',
      setReminder: 'Set reminder',
    }
};

