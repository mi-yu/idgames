$(document).ready(function() {
	var numCorrect = 0
	var total = 0
	var currIndex = 0
	var currFolder = ""
	var gameType = ""

	var getNewImg = function() {
		$("#answer").addClass("hidden")

		$.get('/api/newImg/'+gameType, function (data) {
			var newImg = JSON.parse(data)
			//console.log(newImg)
			currFolder=newImg.title
			//console.log(newImg.title)
			//console.log(newImg.publicLink)
			$("#image-container > img").attr('src',newImg.publicLink)
		})

		$("#loading-wrapper").removeClass("hidden")
		$("img").addClass("hidden")
		$("#image-container > img").on('load', function() {
			$("#loading-wrapper").addClass("hidden")
			$("#image-container > img").removeClass("hidden")			
		})
	}

	var result = $("#result")

	var validate = function() {
		var input = $("#answer-box").val().trim().toLowerCase()
		//console.log("input vs ans "+input+" "+currFolder.toLowerCase())
		if(input===currFolder.toLowerCase()) {
			// result.text("Correct!")
			// result.removeClass("alert-danger").addClass("alert-success")
			// result.removeClass("hidden")
			//console.log("correct")
			$("#answer-box").val("")
			$("#answer").addClass("hidden")
			incrementCount(true)
			getNewImg()
		}
		else if (input!=="") {
			// result.text("You are wrong!")
			// result.addClass("alert-danger").removeClass("alert-success")
			// result.removeClass("hidden")
			//console.log("incorrect")
			incrementCount(false)
			$("#answer-box").val("")
		}
	}

	var updateAns = function() {
		$("#answer-box").attr('placeholder', currFolder.replace(/\_/g, ' '))
	}

	var incrementCount = function(correct) {
		if (correct) {
			numCorrect++
			total++
		}
		else {
			total++
		}
		$("#correct").text(numCorrect)
		$("#wrong").text(total-numCorrect)
		$("#percent").text(Math.round(numCorrect/total*100)+"%")
	}

	$("#start-game").click( function() {
		$(this).addClass("hidden")
		$("#options, #instructions-container, #logo, #intro").addClass("hidden")
		$("#image-container, #input-container, #stats, #controls").removeClass("hidden")
		gameType = $("input:checked").val()
		$("#folder-link").attr("href","https://drive.google.com/drive/folders/"+gameType)
		getNewImg(gameType)
	})

	$("#skip").click( function() {
		incrementCount(false)
		$("#show-ans").removeClass("fa-eye-slash")
		$("#show-ans").addClass("fa-eye")

		if ($("#show-ans").hasClass("fa-eye")) {
			$("#answer-box").attr('placeholder', 'Answer')
		}
		getNewImg(gameType)
	})

	$("#show-ans").click( function() {
		updateAns()
		$(this).toggleClass("fa-eye-slash")
		$(this).toggleClass("fa-eye")

		if ($(this).hasClass("fa-eye")) {
			$("#answer-box").attr('placeholder', 'Answer')
		}
	})

	$("#answer-box").keypress(function (e) {
		var key = e.which
		if (key==13) {
			validate()
		}
	})

	$("#close-modal, #help-button").click( function() {
		$('.modal').toggleClass('hidden')
	})
})
