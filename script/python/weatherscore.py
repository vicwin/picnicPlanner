#!/usr/bin/python
import numpy as np
outflag = False
#outflag = True

def weatherscore(avgtemp,precipchance):
	#Debug output
	if (outflag):
		print ("INSIDE: Average Temp:         " + str(avgtemp))
		print ("INSIDE: Precipitation Chance: " + str(precipchance))

	#Parameters
	ideallow = 65.0
	idealhigh = 85.0
	minlow = 32
	maxhigh = 120
	precipthreshold = .10
	hotflag = False
	wayhotflag = False
	coldflag = False
	waycoldflag = False
	rainflag = False
	messageset = False

	#tempweight + precipweight should equal 1
	tempweight = .25
	precipweight = .75

	score = 0
	scoretext = "GREEN: Should be a beautiful day!"

	#Temperature

	if (avgtemp > idealhigh):
		if (avgtemp > maxhigh):
			score += 0
			wayhotflag = True
			if (outflag):
				print ("WAY Too Hot : " + str(avgtemp))
				print ("Temp Score: " + str(0))
		else:
			foofloat = (100 * tempweight * (1- ((avgtemp - idealhigh) / (maxhigh - idealhigh))))
			score += foofloat
			hotflag = True
			if (outflag):
				print ("Too Hot : " + str(avgtemp))
				print ("Temp Score: " + str(foofloat))
	elif (avgtemp < ideallow):
		if (avgtemp < minlow):
			score += 0
			waycoldflag = True
			if (outflag):
				print ("WAY Too Cold : " + str(avgtemp))
				print ("Temp Score: " + str(0))
		else:
			foofloat = (100 * tempweight * (1- ((ideallow - avgtemp) / (ideallow - minlow))))
			score += foofloat
			coldflag = True
			if (outflag):
				print ("Too Cold : " + str(avgtemp))
				print ("Temp Score: " + str(foofloat))
	else:
		foofloat = (100 * tempweight)
		score += foofloat
		if (outflag):
			print ("Just Right : " + str(avgtemp))
			print ("Temp Score: " + str(foofloat))

	#Precipitation
	if (precipchance > precipthreshold):
		foofloat = (100 * precipweight * (1 - precipchance)**2)
		score += foofloat
		rainflag = True
		if (outflag):
			print ("Too Rainy : " + str(precipchance))
			print ("Precip Score: " + str(foofloat))
	else:
		foofloat = (100 * precipweight)
		score += foofloat

		if (outflag):
			print ("Just Right: " + str(precipchance))
			print ("Precip Score: " + str(foofloat))


	if ((not messageset) and (wayhotflag)):
		scoretext = "RED: Too hot to go out!"
		messageset = True
	if ((not messageset) and (waycoldflag)):
		scoretext = "RED: Too cold to go out!"
		messageset = True
	if ((not messageset) and (coldflag) and (not rainflag)):
		scoretext = "YELLOW: Sunny, but chilly"
		messageset = True
	if ((not messageset) and (hotflag) and (not rainflag)):
		scoretext = "YELLOW: Sunny, but very warm"
		messageset = True
	if ((not messageset) and (hotflag) and rainflag):
		scoretext = "YELLOW: Warm, and chance of rain"
		messageset = True
	if ((not messageset) and (coldflag) and rainflag):
		scoretext = "YELLOW: Cool, and chance of rain"
		messageset = True
	if ((not messageset) and rainflag):
		scoretext = "YELLOW: Chance of rain"
		messageset = True

	return (int(score),scoretext)


