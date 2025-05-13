const API_URL = 'http://localhost:3000'

export const createStoryApi = async (storyName, storyText, storyImages, longitude, latitude) => {
  const body = new FormData()
  for (const image of storyImages) {
    body.append('images', image, image.name)
  }
  body.append('storyName', storyName)
  body.append('storyText', storyText)
  body.append('longitude', longitude)
  body.append('latitude', latitude)
  const response = await fetch(`${API_URL}/stories/createStory`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось создать иторию')
  }

  return data;
}

export const getStoriesApi = async () => {
  const response = await fetch(`${API_URL}/stories/getStories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список историй')
  }

  return data
}

export const getStoriesByAuthorIdApi = async (authorId) => {
  const response = await fetch(`${API_URL}/stories/getStoriesByAuthorId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      authorId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список историй автора')
  }

  return data
}

export const likeStoryApi = async (storyId) => {
  const response = await fetch(`${API_URL}/stories/likeStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось поставить истории отметку нравится')
  }

  return data
}

export const dislikeStoryApi = async (storyId) => {
  const response = await fetch(`${API_URL}/stories/dislikeStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось поставить истории отметку не нравится')
  }

  return data
}

export const subscribeApi = async (authorId) => {
  const response = await fetch(`${API_URL}/stories/subscribeAuthor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      authorId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось подписаться на автора')
  }

  return data
}


export const commentApi = async (storyId, commentText) => {
  const response = await fetch(`${API_URL}/stories/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId, commentText
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось добавить комментарий к истории')
  }

  return data
}


export const getSubscribedAuthorsStoriesApi = async () => {
  const response = await fetch(`${API_URL}/stories/getSubscribedAuthorsStories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось загрузить ленту')
  }

  return data
}


export const getMyProfileInfoApi = async () => {
  const response = await fetch(`${API_URL}/stories/getMyProfileInfo`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось загрузить данные о профиле')
  }

  return data
}


export const deleteStoryApi = async (storyId) => {
  const response = await fetch(`${API_URL}/stories/deleteStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось добавить комментарий к истории')
  }

  return data
}


export const updateProfileDescriptionApi = async (description) => {
  const response = await fetch(`${API_URL}/stories/updateProfileDescription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      description
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось обновить описание профиля')
  }

  return data
}