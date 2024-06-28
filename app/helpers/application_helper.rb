module ApplicationHelper
  def rank_class(rank)
    case rank
    when 1
      "border-l-8 border-yellow-400 pl-4 py-2"
    when 2, 3
      "border-l-4 border-gray-300 pl-4 py-2"
    else
      "pl-4 py-2"
    end
  end

  def rank_title_class(rank)
    case rank
    when 1
      "text-2xl font-bold text-gray-800"
    when 2, 3
      "text-xl font-semibold text-gray-800"
    else
      "text-lg text-gray-700"
    end
  end

  def rank_time_class(rank)
    case rank
    when 1
      "text-lg text-gray-600"
    when 2, 3
      "text-base text-gray-600"
    else
      "text-base text-gray-600"
    end
  end
end
